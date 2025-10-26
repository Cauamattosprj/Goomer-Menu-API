import type { Product } from "@/src/domain/entities/Product";


export interface ProductRepositoryPort {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  save(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
}