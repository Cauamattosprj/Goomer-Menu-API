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
  private description?: string;
  private isActive: boolean = true;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(params: {
    id?: string;
    name: string;
    description?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id || uuidv4();
    this.name = params.name;
    this.description = params.description;
    this.isActive = params.isActive ?? true;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
  }

  // Getters
  getId(): string | undefined {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Setters 
  setName(name: string): void {
    this.name = name;
    this.updateTimestamp();
  }

  setDescription(description: string): void {
    this.description = description;
    this.updateTimestamp();
  }

  setIsActive(isActive: boolean): void {
    this.isActive = isActive;
    this.updateTimestamp();
  }

  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  getConsolidatedMenu(
    products: Product[],
    promotions: Promotion[],
    currentDate?: Date
  ): ConsolidatedMenu {
    const now = currentDate || new Date();
    const currentDay = this.getCurrentDay(now);
    const currentTime = this.getCurrentTime(now);

    const visibleProducts = products.filter(
      (product) => product.isVisible() && product.getCategory()
    );

    const productsWithPromotions: MenuItem[] = visibleProducts.map(
      (product) => {
        const activePromotions = promotions.filter(
          (promotion) =>
            !promotion.getIsExpired() &&
            promotion.hasProduct(product) &&
            this.isPromotionActive(promotion, currentDay, currentTime)
        );

        const activePromotion =
          activePromotions.length > 0 ? activePromotions[0] : null;

        const finalPrice = activePromotion
          ? this.calculateFinalPrice(product.getPrice(), activePromotion)
          : product.getPrice();

        return {
          product,
          activePromotion,
          finalPrice,
        };
      }
    );

    const categories = this.groupByCategory(productsWithPromotions);

    return {
      menuId: this.id,
      menuName: this.name,
      categories,
      lastUpdated: this.updatedAt,
    };
  }

  private getCurrentDay(date: Date): string {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    return days[date.getDay()];
  }

  private getCurrentTime(date: Date): number {
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

    if (!validDays.includes(currentDay)) {
      return false;
    }

    if (currentTime >= startHour && currentTime <= endHour) {
      return true;
    }

    return false;
  }

  private calculateFinalPrice(
    originalPrice: number,
    promotion: Promotion
  ): number {
    const discountPrice = promotion.getDiscountPrice();
    const discountPercentage = promotion.getDiscountPercentage();

    if (discountPrice !== undefined) {
      return discountPrice;
    }

    if (discountPercentage !== undefined) {
      const finalPrice = Math.round(originalPrice * (1 - discountPercentage));

      return finalPrice;
    }

    return originalPrice;
  }
  private groupByCategory(products: MenuItem[]): Record<string, MenuItem[]> {
    return products.reduce((acc: Record<string, MenuItem[]>, item) => {
      const category = item.product.getCategory();
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  }
}

export interface ConsolidatedMenu {
  menuId: string;
  menuName: string;
  categories: Record<string, MenuItem[]>;
  lastUpdated: Date;
}
