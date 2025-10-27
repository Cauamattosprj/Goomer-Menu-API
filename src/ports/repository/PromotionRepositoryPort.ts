import { Promotion } from "@/domain/entities/Promotion";

export interface PromotionRepositoryPort {
  findActivePromotions(): Promise<Promotion[]>;
  findById(id: string): Promise<Promotion | null>;
  findByProductId(productId: string): Promise<Promotion[]>;
  save(promotion: Promotion): Promise<Promotion>;
  delete(id: string): Promise<void>;
}
