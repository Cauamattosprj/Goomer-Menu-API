import { Product } from "@/domain/entities/Product";


export interface ProductRepositoryPort {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findByName(name: string): Promise<Product | null>
  save(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
}