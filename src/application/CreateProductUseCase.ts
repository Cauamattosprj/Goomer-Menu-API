import type { ProductRepositoryPort } from "../ports/repository/ProductRepositoryPort";
import { Product } from "../domain/entities/Product";
import { ProductDTO } from "../domain/dto/ProductDTO";
import { ProductService } from "../domain/services/ProductService";

export class CreateProductUseCase {
  constructor(
    private readonly productRepo: ProductRepositoryPort,
    private readonly productService: ProductService
  ) {}

  async execute(productDTO: ProductDTO): Promise<ProductDTO> {
    if (productDTO.price < 0) throw new Error("Preço inválido");

    this.productService.createProduct(productDTO)

    return productDTO;
  }
}
