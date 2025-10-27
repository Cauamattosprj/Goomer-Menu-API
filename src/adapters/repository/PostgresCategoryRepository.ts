// adapters/repository/PostgresCategoryRepository.ts
import { DatabaseConnection } from "@/infra/database/DatabaseConnection";
import { Category } from "@/domain/entities/Category";
import type { CategoryRepositoryPort } from "@/ports/repository/CategoryRepositoryPort";

// Interface para as rows do banco
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
      return new Category({ id: row.id, name: row.category });
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
      return new Category({ id: row.id, name: row.category });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      throw new Error(`Failed to find category: ${errorMessage}`);
    }
  }

  async create(name: string): Promise<Category> {
    try {
      const result = await DatabaseConnection.query(
        "INSERT INTO categories (id, category) VALUES (gen_random_uuid(), $1) RETURNING id, category",
        [name]
      );

      const row = result.rows[0] as CategoryRow;
      return new Category({ id: row.id, name: row.category });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      throw new Error(`Failed to create category: ${errorMessage}`);
    }
  }

  async findOrCreate(name: string): Promise<Category> {
    const existing = await this.findByName(name);
    if (existing) {
      return existing;
    }
    return await this.create(name);
  }
}
