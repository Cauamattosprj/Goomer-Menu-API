import type { ProductRepositoryPort } from "../../ports/repository/ProductRepositoryPort";
import { Product } from "../../domain/entities/Product";
import type { ProductDTO } from "../dto/ProductDTO";

export class ProductService {
  constructor(private readonly productRepo: ProductRepositoryPort) {}

  async createProduct(data: ProductDTO): Promise<Product> {
    const product: Product = new Product({
      category: data.category,
      name: data.name,
      price: data.price
    });
    await this.productRepo.save(product);
    return product;
  }
}
