import type { ProductRepositoryPort } from "@/ports/repository/ProductRepositoryPort";
import type { PromotionRepositoryPort } from "@/ports/repository/PromotionRepositoryPort";
import type { CategoryRepositoryPort } from "@/ports/repository/CategoryRepositoryPort";
import { Menu, SimpleMenu } from "@/domain/entities/Menu";

export class GetMenuWithProductsAndPromotionsUseCase {
  constructor(
    private productRepository: ProductRepositoryPort,
    private promotionRepository: PromotionRepositoryPort,
    private categoryRepository: CategoryRepositoryPort
  ) {}

  async execute(menuName: string = "Menu Principal"): Promise<SimpleMenu> {
    const products = await this.productRepository.findAll();
    const promotions = await this.promotionRepository.findActivePromotions();
    const categories = await this.categoryRepository.findAll();

    const categoryMap = new Map<string, string>();
    categories.forEach(category => {
      categoryMap.set(category.getId(), category.getName());
    });

    const menu = new Menu({
      name: menuName,
    });

    const menuWithProductsAndPromotions = menu.getMenuWithProductsAndPromotions(
      products,
      promotions,
      categoryMap
    );

    return menuWithProductsAndPromotions;
  }
}