import { DatabaseConnection } from "@/infra/database/DatabaseConnection";
import { Category } from "@/domain/entities/Category";
import type { CategoryRepositoryPort } from "@/ports/repository/CategoryRepositoryPort";

interface CategoryRow {
  id: string;
  category: string;
}

export class PostgresCategoryRepository implements CategoryRepositoryPort {
  async findById(id: string): Promise<Category | null> {
    try {
      const result = await DatabaseConnection.query(
        "SELECT id, category FROM categories WHERE id = $1",
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0] as CategoryRow;
      return new Category({
        id: row.id,
        name: row.category,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to find category by id: ${errorMessage}`);
    }
  }

  async findByName(name: string): Promise<Category | null> {
    try {
      const result = await DatabaseConnection.query(
        "SELECT id, category FROM categories WHERE category = $1",
        [name]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0] as CategoryRow;
      return new Category({
        id: row.id,
        name: row.category,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to find category by name: ${errorMessage}`);
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      const result = await DatabaseConnection.query(
        "SELECT id, category FROM categories ORDER BY category"
      );

      return result.rows.map(
        (row: CategoryRow) =>
          new Category({
            id: row.id,
            name: row.category,
          })
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to find all categories: ${errorMessage}`);
    }
  }

  async update(category: Category): Promise<void> {
    try {
      await DatabaseConnection.query(
        `UPDATE categories 
         SET category = $1
         WHERE id = $2`,
        [category.getName(), category.getId()]
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to update category: ${errorMessage}`);
    }
  }

  async save(category: Category): Promise<void> {
    try {
      await DatabaseConnection.query(
        `INSERT INTO categories (id, category) 
         VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET
           category = EXCLUDED.category`,
        [category.getId(), category.getName()]
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to save category: ${errorMessage}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await DatabaseConnection.query("DELETE FROM categories WHERE id = $1", [
        id,
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to delete category: ${errorMessage}`);
    }
  }

  async findOrCreate(name: string): Promise<Category> {
    const existingCategory = await this.findByName(name);
    if (existingCategory) {
      return existingCategory;
    }

    const newCategory = new Category({ name });
    await this.save(newCategory);
    return newCategory;
  }
}
