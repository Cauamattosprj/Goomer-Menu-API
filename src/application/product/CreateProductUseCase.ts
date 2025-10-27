import type { ProductRepositoryPort } from "@/ports/repository/ProductRepositoryPort";
import type { ProductService } from "@/domain/services/ProductService";
import { ProductDTO } from "@/domain/dto/ProductDTO";
import { Product } from "@/domain/entities/Product";

export class CreateProductUseCase {
  constructor(
    private productRepository: ProductRepositoryPort,
    private productService: ProductService
  ) {}

  async execute(productDTO: ProductDTO): Promise<ProductDTO> {
    await this.productService.validateProduct(productDTO);

    const product = new Product({
      name: productDTO.name,
      price: productDTO.price,
      categoryId: productDTO.category?.id,
    });

    await this.productRepository.save(product);

    return ProductDTO.fromEntity(product);
  }
}
