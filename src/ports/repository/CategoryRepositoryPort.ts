import { Category } from "@/domain/entities/Category";

export interface CategoryRepositoryPort {
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  save(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
  update(category: Category): Promise<void>;
}