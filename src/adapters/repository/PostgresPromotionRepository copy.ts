import { DatabaseConnection } from "@/infra/database/DatabaseConnection";
import { Promotion } from "@/domain/entities/Promotion";
import { Product } from "@/domain/entities/Product";
import type { PromotionRepositoryPort } from "@/ports/repository/PromotionRepositoryPort";
import { TimeRange } from "@/domain/value-objects/TimeRange";

interface PromotionRow {
  id: string;
  description: string;
  promotion_price: number | null;
  promotion_percentage: number | null;
  valid_days: string[];
  valid_hours_start: number[];
  valid_hours_end: number[];
  valid_until: Date | null;
  is_expired: boolean;
}

interface PromotionWithProductsRow extends PromotionRow {
  product_id: string | null;
  product_name: string | null;
  product_price: number | null;
  product_category_id: string | null;
  product_is_visible: boolean | null;
}

export class PostgresPromotionRepository implements PromotionRepositoryPort {
  async findActivePromotions(): Promise<Promotion[]> {
    try {

      const result = await DatabaseConnection.query(
        `SELECT 
           id, 
           description, 
           promotion_price, 
           promotion_percentage,
           valid_days,
           valid_hours_start,
           valid_hours_end,
           valid_until,
           is_expired
         FROM promotions 
         WHERE is_expired = false`
      );


      if (result.rows.length === 0) {
        return [];
      }

      const promotions: Promotion[] = [];

      for (const row of result.rows) {

        try {
          const startTime = Array.isArray(row.valid_hours_start)
            ? row.valid_hours_start[0]
            : row.valid_hours_start;
          const endTime = Array.isArray(row.valid_hours_end)
            ? row.valid_hours_end[0]
            : row.valid_hours_end;


          const timeRange = new TimeRange(
            this.formatTime(startTime),
            this.formatTime(endTime)
          );

          const products = await this.findProductsByPromotionId(row.id);

          const promotion = new Promotion({
            id: row.id,
            description: row.description,
            discountPrice: row.promotion_price ?? undefined,
            discountPercentage: row.promotion_percentage ?? undefined,
            validDays: row.valid_days,
            timeRange: timeRange,
            validUntil: row.valid_until ?? undefined,
            isExpired: row.is_expired,
            products: products,
          });

          promotions.push(promotion);
        } catch (error) {
        }
      }

      return promotions;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to find active promotions: ${errorMessage}`);
    }
  }

  private async findProductsByPromotionId(
    promotionId: string
  ): Promise<Product[]> {
    try {
      const result = await DatabaseConnection.query(
        `SELECT 
           pr.product_id,
           prod.name as product_name,
           prod.price as product_price,
           prod.category_id as product_category_id,
           prod.is_visible as product_is_visible
         FROM product_promotions pr
         INNER JOIN products prod ON pr.product_id = prod.id
         WHERE pr.promotion_id = $1 AND pr.is_active = true AND prod.is_visible = true`,
        [promotionId]
      );

      return result.rows.map(
        (row: any) =>
          new Product({
            id: row.product_id,
            name: row.product_name,
            price: row.product_price,
            categoryId: row.product_category_id,
            visible: row.product_is_visible,
          })
      );
    } catch (error) {
      console.error(
        `Erro ao buscar produtos da promoção ${promotionId}:`,
        error
      );
      return [];
    }
  }

  private formatTime(timeNumber: number): string {
    const hours = Math.floor(timeNumber / 100);
    const minutes = timeNumber % 100;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }
  async findById(id: string): Promise<Promotion | null> {
    try {
      const result = await DatabaseConnection.query(
        `SELECT 
         p.id, 
         p.description, 
         p.promotion_price, 
         p.promotion_percentage,
         p.valid_days,
         p.valid_hours_start,
         p.valid_hours_end,
         p.valid_until,
         p.is_expired
       FROM promotions p
       WHERE p.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];

      const startTime = Array.isArray(row.valid_hours_start)
        ? row.valid_hours_start[0]
        : row.valid_hours_start;
      const endTime = Array.isArray(row.valid_hours_end)
        ? row.valid_hours_end[0]
        : row.valid_hours_end;

      const timeRange = new TimeRange(
        this.formatTime(startTime),
        this.formatTime(endTime)
      );

      const products = await this.findProductsByPromotionId(id);

      return new Promotion({
        id: row.id,
        description: row.description,
        discountPrice: row.promotion_price ?? undefined,
        discountPercentage: row.promotion_percentage ?? undefined,
        validDays: row.valid_days,
        timeRange: timeRange,
        validUntil: row.valid_until ?? undefined,
        isExpired: row.is_expired,
        products: products,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to find promotion by id: ${errorMessage}`);
    }
  }

  async findByProductId(productId: string): Promise<Promotion[]> {
    try {
      const result = await DatabaseConnection.query(
        `SELECT 
           p.id, 
           p.description, 
           p.promotion_price, 
           p.promotion_percentage,
           p.valid_days,
           p.valid_hours_start,
           p.valid_hours_end,
           p.valid_until,
           p.is_expired,
           pr.product_id,
           prod.name as product_name,
           prod.price as product_price,
           prod.category_id as product_category_id,
           prod.is_visible as product_is_visible
         FROM promotions p
         INNER JOIN product_promotions pr ON p.id = pr.promotion_id AND pr.is_active = true
         INNER JOIN products prod ON pr.product_id = prod.id AND prod.is_visible = true
         WHERE pr.product_id = $1 
           AND p.is_expired = false 
           AND (p.valid_until IS NULL OR p.valid_until >= NOW())`,
        [productId]
      );

      if (result.rows.length === 0) {
        return [];
      }

      const promotionsMap = new Map<string, Promotion>();

      for (const row of result.rows as PromotionWithProductsRow[]) {
        const promotionId = row.id;

        if (!promotionsMap.has(promotionId)) {
          const promotion = new Promotion({
            id: row.id,
            description: row.description,
            discountPrice: row.promotion_price ?? undefined,
            discountPercentage: row.promotion_percentage ?? undefined,
            validDays: row.valid_days,
            validHourStart: row.valid_hours_start[0],
            validHourEnd: row.valid_hours_end[0],
            validUntil: row.valid_until ?? undefined,
            isExpired: row.is_expired,
            products: [],
          });
          promotionsMap.set(promotionId, promotion);
        }

        if (row.product_id && row.product_name && row.product_price !== null) {
          const product = new Product({
            id: row.product_id,
            name: row.product_name,
            price: row.product_price,
            categoryId: row.product_category_id ?? undefined,
            visible: row.product_is_visible ?? true,
          });

          const promotion = promotionsMap.get(promotionId);
          if (promotion) {
            promotion.getProducts().push(product);
          }
        }
      }

      return Array.from(promotionsMap.values());
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(
        `Failed to find promotions by product id: ${errorMessage}`
      );
    }
  }

  async save(promotion: Promotion): Promise<Promotion> {
    try {
      await DatabaseConnection.query(
        `INSERT INTO promotions 
        (id, description, promotion_price, promotion_percentage, valid_days, valid_hours_start, valid_hours_end, valid_until, is_expired)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         description = EXCLUDED.description,
         promotion_price = EXCLUDED.promotion_price,
         promotion_percentage = EXCLUDED.promotion_percentage,
         valid_days = EXCLUDED.valid_days,
         valid_hours_start = EXCLUDED.valid_hours_start,
         valid_hours_end = EXCLUDED.valid_hours_end,
         valid_until = EXCLUDED.valid_until,
         is_expired = EXCLUDED.is_expired`,
        [
          promotion.getId(),
          promotion.getDescription(),
          promotion.getDiscountPrice(),
          promotion.getDiscountPercentage(),
          promotion.getValidDays(),
          [promotion.getTimeRange().getStart()],
          [promotion.getTimeRange().getEnd()],
          promotion.getValidUntil(),
          promotion.getIsExpired(),
        ]
      );

      await DatabaseConnection.query(
        "DELETE FROM product_promotions WHERE promotion_id = $1",
        [promotion.getId()]
      );

     
      const products = promotion.getProducts();
      for (const product of products) {
        const productId = product.getId();
        if (productId) {
       
          await DatabaseConnection.query(
            `INSERT INTO product_promotions (promotion_id, product_id, is_active)
           VALUES ($1, $2, true)`,
            [promotion.getId(), productId]
          );
        } else {
        }
      }

      return promotion;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to save promotion: ${errorMessage}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await DatabaseConnection.query("DELETE FROM promotions WHERE id = $1", [
        id,
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to delete promotion: ${errorMessage}`);
    }
  }
}
