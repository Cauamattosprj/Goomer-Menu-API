import type { PromotionRepositoryPort } from "@/ports/repository/PromotionRepositoryPort";
import type { ProductRepositoryPort } from "@/ports/repository/ProductRepositoryPort";
import { PromotionDTO } from "@/domain/dto/PromotionDTO";

export class CreatePromotionUseCase {
  constructor(
    private promotionRepository: PromotionRepositoryPort,
    private productRepository: ProductRepositoryPort
  ) {}

  async execute(promotionDTO: PromotionDTO): Promise<PromotionDTO> {
    const productIds = promotionDTO.products?.map(p => p.id).filter((id): id is string => !!id) || [];
    const products = await Promise.all(
      productIds.map(id => this.productRepository.findById(id))
    );
    
    const validProducts = products.filter((p): p is NonNullable<typeof p> => p !== null);
    
    const promotion = PromotionDTO.toEntity(promotionDTO, validProducts);
    await this.promotionRepository.save(promotion);
    return PromotionDTO.fromEntity(promotion);
  }
}