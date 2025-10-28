import type { PromotionRepositoryPort } from "@/ports/repository/PromotionRepositoryPort";
import { PromotionDTO } from "@/domain/dto/PromotionDTO";

export class GetPromotionUseCase {
  constructor(private promotionRepository: PromotionRepositoryPort) {}

  async execute(id: string): Promise<PromotionDTO> {
    const promotion = await this.promotionRepository.findById(id);
    if (!promotion) {
      throw new Error("Promotion not found");
    }
    return PromotionDTO.fromEntity(promotion);
  }
}