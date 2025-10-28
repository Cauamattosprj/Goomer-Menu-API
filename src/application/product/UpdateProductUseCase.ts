import type { ProductRepositoryPort } from "@/ports/repository/ProductRepositoryPort";
import { ProductDTO } from "@/domain/dto/ProductDTO";
import { Product } from "@/domain/entities/Product";

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepositoryPort) {}

  async execute(id: string, productDTO: ProductDTO): Promise<ProductDTO> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    const product = new Product({
      id: id,
      name: productDTO.name,
      price: productDTO.price,
      categoryId: productDTO.categoryId,
      visible: productDTO.visible ?? true,
    });

    await this.productRepository.update(product);
    return ProductDTO.fromEntity(product);
  }
}