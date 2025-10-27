import type { ProductRepositoryPort } from "@/ports/repository/ProductRepositoryPort";
import type { ProductService } from "@/domain/services/ProductService";
import { ProductDTO } from "@/domain/dto/ProductDTO";

export class GetProductUseCase {
  constructor(
    private productRepository: ProductRepositoryPort,
    private productService: ProductService
  ) {}

  async execute(productId: string): Promise<ProductDTO> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    return ProductDTO.fromEntity(product);
  }
}
