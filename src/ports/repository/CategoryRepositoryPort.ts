import { Category } from "@/domain/entities/Category";

export interface CategoryRepositoryPort {
  findByName(name: string): Promise<Category | null>;
  create(name: string): Promise<Category>;
  findOrCreate(name: string): Promise<Category>;
  findById(id: string): Promise<Category | null>;
}
