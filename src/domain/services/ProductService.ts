import type { ProductRepositoryPort } from "../../ports/repository/ProductRepositoryPort";
import { Product } from "../../domain/entities/Product";
import type { ProductDTO } from "../dto/ProductDTO";

export class ProductService {
  constructor(private readonly productRepo: ProductRepositoryPort) {}

  async createProduct(data: ProductDTO): Promise<Product> {
    const product: Product = new Product({
      name: data.name,
      price: data.price,
      categoryId: data.category?.id ?? undefined,
    });
    await this.productRepo.save(product);
    return product;
  }

  async validateProduct(productDTO: ProductDTO): Promise<void> {
    if (!productDTO.name || productDTO.name.trim() === "") {
      throw new Error("Product name is required");
    }

    if (productDTO.price <= 0) {
      throw new Error("Product price must be greater than 0");
    }

    const existingProduct = await this.productRepo.findByName(productDTO.name);
    if (existingProduct) {
      throw new Error("Product with this name already exists");
    }
  }
}
