// application/usecases/GetMenuWithProductsAndPromotionsUseCase.ts
import type { ProductRepositoryPort } from "@/ports/repository/ProductRepositoryPort";
import type { PromotionRepositoryPort } from "@/ports/repository/PromotionRepositoryPort";
import { Menu } from "@/domain/entities/Menu";

export class GetMenuWithProductsAndPromotionsUseCase {
  constructor(
    private productRepository: ProductRepositoryPort,
    private promotionRepository: PromotionRepositoryPort
  ) {}

  async execute(menuName: string = "Menu Principal"): Promise<any> {
    // Busca todos os produtos
    const products = await this.productRepository.findAll();

    // Busca todas as promoções ativas
    const promotions = await this.promotionRepository.findActivePromotions();

    // Cria o menu em runtime (não persistido)
    const menu = new Menu({
      name: menuName,
    });

    // Usa o método simplificado da classe Menu para obter o menu consolidado
    const menuWithProductsAndPromotions = menu.getMenuWithProductsAndPromotions(
      products,
      promotions
    );

    return menuWithProductsAndPromotions;
  }
}
