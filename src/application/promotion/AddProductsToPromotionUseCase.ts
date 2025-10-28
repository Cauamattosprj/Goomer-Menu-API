import type { PromotionRepositoryPort } from "@/ports/repository/PromotionRepositoryPort";
import type { ProductRepositoryPort } from "@/ports/repository/ProductRepositoryPort";
import { PromotionDTO } from "@/domain/dto/PromotionDTO";

export class AddProductsToPromotionUseCase {
  constructor(
    private promotionRepository: PromotionRepositoryPort,
    private productRepository: ProductRepositoryPort
  ) {}

  async execute(promotionId: string, productIds: string[]): Promise<PromotionDTO> {

    const promotion = await this.promotionRepository.findById(promotionId);
    if (!promotion) {
      throw new Error("Promotion not found");
    }

    const products = await Promise.all(
      productIds.map(id => this.productRepository.findById(id))
    );


    const validProducts = products.filter((p): p is NonNullable<typeof p> => p !== null);
    
    if (validProducts.length === 0) {
      throw new Error("No valid products found");
    }


    validProducts.forEach(product => {
      if (!promotion.hasProduct(product)) {
        promotion.addProduct(product);
      } else {
      }
    });

    await this.promotionRepository.save(promotion);
    
    return PromotionDTO.fromEntity(promotion);
  }
}