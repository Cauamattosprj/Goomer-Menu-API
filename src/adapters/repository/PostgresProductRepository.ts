import { DatabaseConnection } from "@/infra/database/DatabaseConnection";
import { Product } from "@/domain/entities/Product";
import type { ProductRepositoryPort } from "@/ports/repository/ProductRepositoryPort";

interface ProductWithCategoryRow {
  id: string;
  name: string;
  price: number;
  category_id: string | null;
  is_visible: boolean;
  category_name: string | null;
}

export class PostgresProductRepository implements ProductRepositoryPort {
  async update(product: Product): Promise<void> {
    try {
      await DatabaseConnection.query(
        `UPDATE products 
         SET name = $1, price = $2, category_id = $3, is_visible = $4
         WHERE id = $5`,
        [
          product.getName(),
          product.getPrice(),
          product.getCategoryId(),
          product.isVisible(),
          product.getId()
        ]
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to update product: ${errorMessage}`);
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
           p.is_visible,
           c.category as category_name
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
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

  async findById(id: string): Promise<Product | null> {
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

  async save(product: Product): Promise<void> {
    const id = product.getId();
    const name = product.getName();
    const price = product.getPrice();
    const categoryId = product.getCategoryId();
    const isVisible = product.isVisible();

    try {
      if (categoryId == undefined) {
        await DatabaseConnection.query(
          `INSERT INTO products (id, name, price, is_visible) 
          VALUES ($1, $2, $3, $4)`,
          [id, name, price, isVisible]
        );
      }
      if (categoryId) {
        await DatabaseConnection.query(
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

  async delete(id: string): Promise<void> {
    try {
      await DatabaseConnection.query(
        "DELETE FROM products WHERE id = $1",
        [id]
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to delete product: ${errorMessage}`);
    }
  }

  async findAllWithCategories(): Promise<Product[]> {
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
}
