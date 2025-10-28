import { PostgresCategoryRepository } from "@/adapters/repository/PostgresCategoryRepository";
import { ProductDTO } from "../dto/ProductDTO";
import { Product } from "./Product";
import { Promotion } from "./Promotion";
import { v4 as uuidv4 } from "uuid";
import { DatabaseConnection } from "@/infra/database/DatabaseConnection";

interface MenuItem {
  product: {
    id?: string;
    name: string;
    price: number;
    category?: {
      id: string;
      name: string;
    } | null;
    visible: boolean;
  };
  activePromotion: any;
  finalPrice: number;
}

export class Menu {
  private id: string;
  private name: string;
  private isActive: boolean = true;

  constructor(params: { id?: string; name: string; isActive?: boolean }) {
    this.id = params.id || uuidv4();
    this.name = params.name;
    this.isActive = params.isActive ?? true;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getMenuWithProductsAndPromotions(
    products: Product[],
    promotions: Promotion[],
    categories: Map<string, string>
  ): MenuDTO {
    const now = new Date();
    const currentDay = this.getCurrentDay(now);
    const currentTime = this.getCurrentTime(now);

    const visibleProducts = products.filter((product) => product.isVisible());

    const menuItems: MenuItemDTO[] = visibleProducts.map((product) => {
      const activePromotion =
        promotions.find(
          (promotion) =>
            !promotion.getIsExpired() &&
            promotion.hasProduct(product) &&
            this.isPromotionActive(promotion, currentDay, currentTime)
        ) || null;

      const finalPrice = activePromotion
        ? this.calculateFinalPrice(product.getPrice(), activePromotion)
        : product.getPrice();

      const categoryId = product.getCategoryId();
      const categoryName = categoryId ? categories.get(categoryId) : null;

      const menuItem: MenuItemDTO = {
        id: product.getId()!,
        name: product.getName(),
        price: product.getPrice(),
        finalPrice,
        ...(categoryId &&
          categoryName && {
            category: {
              id: categoryId,
              name: categoryName,
            },
          }),
        ...(activePromotion && {
          promotion: {
            id: activePromotion.getId(),
            description: activePromotion.getDescription(),
            ...(activePromotion.getDiscountPercentage() && {
              discountPercentage: activePromotion.getDiscountPercentage(),
            }),
            ...(activePromotion.getDiscountPrice() && {
              discountPrice: activePromotion.getDiscountPrice(),
            }),
          },
        }),
      };

      return menuItem;
    });

    return {
      menuId: this.id,
      menuName: this.name,
      items: menuItems,
    };
  }

  getCurrentDay(date: Date): string {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    return days[date.getDay()];
  }

  getCurrentTime(date: Date): number {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return hours * 100 + minutes;
  }

  private isPromotionActive(
    promotion: Promotion,
    currentDay: string,
    currentTime: number
  ): boolean {
    const validDays = promotion.getValidDays();
    const startHour = promotion.getTimeRange().getStart();
    const endHour = promotion.getTimeRange().getEnd();

    const isDayValid = validDays.includes(currentDay);
    const isTimeValid = currentTime >= startHour && currentTime <= endHour;

    return isDayValid && isTimeValid;
  }

  private calculateFinalPrice(
    originalPrice: number,
    promotion: Promotion
  ): number {
    const discountPrice = promotion.getDiscountPrice();
    const discountPercentage = promotion.getDiscountPercentage();

    if (discountPrice !== undefined && discountPrice !== null) {
      return discountPrice;
    }

    if (discountPercentage !== undefined && discountPercentage !== null) {
      const discountAmount = originalPrice * (discountPercentage / 100);
      return Math.round(originalPrice - discountAmount);
    }

    return originalPrice;
  }
}

export interface SimpleMenu {
  menuId: string;
  menuName: string;
  items: MenuItem[];
}
