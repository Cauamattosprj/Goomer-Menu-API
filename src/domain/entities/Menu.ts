// domain/entities/Menu.ts
import { Product } from "./Product";
import { Promotion } from "./Promotion";
import { v4 as uuidv4 } from "uuid";

interface MenuItem {
  product: Product;
  activePromotion: Promotion | null;
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
    promotions: Promotion[]
  ): SimpleMenu {
    const now = new Date();
    const currentDay = this.getCurrentDay(now);
    const currentTime = this.getCurrentTime(now);

    const visibleProducts = products.filter((product) => product.isVisible());

    const menuItems: MenuItem[] = visibleProducts.map((product) => {
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

      return {
        product,
        activePromotion,
        finalPrice,
      };
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
    const startHour = promotion.getValidHourStart();
    const endHour = promotion.getValidHourEnd();

    return (
      validDays.includes(currentDay) &&
      currentTime >= startHour &&
      currentTime <= endHour
    );
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
