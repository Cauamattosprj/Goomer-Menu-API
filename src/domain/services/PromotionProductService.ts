import { Product } from "../entities/Product";
import { Promotion } from "../entities/Promotion";

export class PromotionProductService {
  static associatePromotionWithProduct(promotion: Promotion, product: Product): void {
    promotion.addProduct(product);
  }

  static dissociatePromotionFromProduct(promotion: Promotion, product: Product): void {
    promotion.removeProduct(product);
  }
}
