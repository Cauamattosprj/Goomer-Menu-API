// adapters/repository/PostgresPromotionRepository.ts
import { DatabaseConnection } from "@/infra/database/DatabaseConnection";
import { Promotion } from "@/domain/entities/Promotion";
import { Product } from "@/domain/entities/Product";
import type { PromotionRepositoryPort } from "@/ports/repository/PromotionRepositoryPort";

// Interface para as rows do banco
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

// Interface para as rows do JOIN com produtos
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
         LEFT JOIN product_promotions pr ON p.id = pr.promotion_id AND pr.is_active = true
         LEFT JOIN products prod ON pr.product_id = prod.id AND prod.is_visible = true
         WHERE p.is_expired = false 
           AND (p.valid_until IS NULL OR p.valid_until >= NOW())
         ORDER BY p.id, pr.product_id`
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
            validHourStart: row.valid_hours_start[0], // Pega o primeiro elemento do array
            validHourEnd: row.valid_hours_end[0], // Pega o primeiro elemento do array
            validUntil: row.valid_until ?? undefined,
            isExpired: row.is_expired,
            products: [],
          });
          promotionsMap.set(promotionId, promotion);
        }

        // Adiciona produto se existir
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
      throw new Error(`Failed to find active promotions: ${errorMessage}`);
    }
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
           p.is_expired,
           pr.product_id,
           prod.name as product_name,
           prod.price as product_price,
           prod.category_id as product_category_id,
           prod.is_visible as product_is_visible
         FROM promotions p
         LEFT JOIN product_promotions pr ON p.id = pr.promotion_id AND pr.is_active = true
         LEFT JOIN products prod ON pr.product_id = prod.id AND prod.is_visible = true
         WHERE p.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const firstRow = result.rows[0] as PromotionWithProductsRow;
      const products: Product[] = [];

      // Coleta todos os produtos da promoção
      for (const row of result.rows as PromotionWithProductsRow[]) {
        if (row.product_id && row.product_name && row.product_price !== null) {
          const product = new Product({
            id: row.product_id,
            name: row.product_name,
            price: row.product_price,
            categoryId: row.product_category_id ?? undefined,
            visible: row.product_is_visible ?? true,
          });
          products.push(product);
        }
      }

      return new Promotion({
        id: firstRow.id,
        description: firstRow.description,
        discountPrice: firstRow.promotion_price ?? undefined,
        discountPercentage: firstRow.promotion_percentage ?? undefined,
        validDays: firstRow.valid_days,
        validHourStart: firstRow.valid_hours_start[0],
        validHourEnd: firstRow.valid_hours_end[0],
        validUntil: firstRow.valid_until ?? undefined,
        isExpired: firstRow.is_expired,
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

        // Adiciona produto se existir
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
      // Salva a promoção
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
          [promotion.getValidHourStart()], // Converte para array
          [promotion.getValidHourEnd()], // Converte para array
          promotion.getValidUntil(),
          promotion.getIsExpired(),
        ]
      );

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
