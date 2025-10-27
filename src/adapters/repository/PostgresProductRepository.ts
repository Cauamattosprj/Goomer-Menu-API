// adapters/repository/PostgresProductRepository.ts
import { DatabaseConnection } from "@/infra/database/DatabaseConnection";
import { Product } from "@/domain/entities/Product";
import type { ProductRepositoryPort } from "@/ports/repository/ProductRepositoryPort";
import { Category } from "@/domain/entities/Category";

// Interface para as rows do banco com JOIN
interface ProductWithCategoryRow {
  id: string;
  name: string;
  price: number;
  category_id: string | null;
  is_visible: boolean;
  category_name: string | null; // ✅ Adicionado pelo JOIN
}

export class PostgresProductRepository implements ProductRepositoryPort {
  async save(product: Product): Promise<void> {
    const id = product.getId();
    const name = product.getName();
    const price = product.getPrice();
    const categoryId = product.getCategoryId();
    const isVisible = product.isVisible();

    try {
      if (categoryId == undefined) {
        const result = await DatabaseConnection.query(
          `INSERT INTO products (id, name, price, is_visible) 
          VALUES ($1, $2, $3, $4)`,
          [id, name, price, isVisible]
        );
      }
      if (categoryId) {
        const result = await DatabaseConnection.query(
          `INSERT INTO products (id, name, price, category_id, is_visible) 
          VALUES ($1, $2, $3, $4, $5)`,
          [id, name, price, categoryId, isVisible]
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to save product: ${errorMessage}`);
    }
  }

  async findByName(name: string): Promise<Product | null> {
    try {
      const result = await DatabaseConnection.query(
        `SELECT 
           p.id, 
           p.name, 
           p.price, 
           p.category_id, 
           p.is_visible,
           c.category as category_name
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.name = $1 AND p.is_visible = true`,
        [name]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0] as ProductWithCategoryRow;

      return new Product({
        id: row.id,
        name: row.name,
        price: row.price,
        categoryId: row.category_id,
        visible: row.is_visible,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to find product by name: ${errorMessage}`);
    }
  }

  // Método específico se precisar do Product com dados completos da Category
  async findByNameWithCategory(
    name: string
  ): Promise<{ product: Product; category?: Category } | null> {
    try {
      const result = await DatabaseConnection.query(
        `SELECT 
           p.id, 
           p.name, 
           p.price, 
           p.category_id, 
           p.is_visible,
           c.id as category_id,
           c.category as category_name
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.name = $1 AND p.is_visible = true`,
        [name]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0] as ProductWithCategoryRow;

      const product = new Product({
        id: row.id,
        name: row.name,
        price: row.price,
        categoryId: row.category_id,
        visible: row.is_visible,
      });

      let category: Category | undefined;
      if (row.category_id && row.category_name) {
        category = new Category({
          id: row.category_id,
          name: row.category_name,
        });
      }

      return { product, category };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to find product by name: ${errorMessage}`);
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const result = await DatabaseConnection.query(
        `SELECT 
           p.id, 
           p.name, 
           p.price, 
           p.category_id, 
           p.is_visible
         FROM products p
         WHERE p.id = $1 AND p.is_visible = true`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0] as ProductWithCategoryRow;
      return new Product({
        id: row.id,
        name: row.name,
        price: row.price,
        categoryId: row.category_id,
        visible: row.is_visible,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to find product by id: ${errorMessage}`);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const result = await DatabaseConnection.query(
        `SELECT 
           p.id, 
           p.name, 
           p.price, 
           p.category_id, 
           p.is_visible
         FROM products p
         WHERE p.is_visible = true
         ORDER BY p.name`
      );

      return result.rows.map(
        (row: ProductWithCategoryRow) =>
          new Product({
            id: row.id,
            name: row.name,
            price: row.price,
            categoryId: row.category_id,
            visible: row.is_visible,
          })
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to find all products: ${errorMessage}`);
    }
  }

  async findAllWithCategories(): Promise<
    { product: Product; category?: Category }[]
  > {
    try {
      const result = await DatabaseConnection.query(
        `SELECT 
           p.id, 
           p.name, 
           p.price, 
           p.category_id, 
           p.is_visible,
           c.id as category_full_id,
           c.category as category_name
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.is_visible = true
         ORDER BY p.name`
      );

      return result.rows.map(
        (row: ProductWithCategoryRow & { category_full_id: string }) => {
          const product = new Product({
            id: row.id,
            name: row.name,
            price: row.price,
            categoryId: row.category_id,
            visible: row.is_visible,
          });

          let category: Category | undefined;
          if (row.category_full_id && row.category_name) {
            category = new Category({
              id: row.category_full_id,
              name: row.category_name,
            });
          }

          return { product, category };
        }
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(
        `Failed to find all products with categories: ${errorMessage}`
      );
    }
  }

  async delete(id: string): Promise<void> {
    //
  }
}
