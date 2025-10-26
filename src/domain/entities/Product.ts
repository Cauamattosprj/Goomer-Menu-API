import { Promotion } from "./Promotion";

export class Product {
  private id?: string | undefined;
  private name: string;
  private price: number;
  private category: string;
  private visible: boolean = true;
  private promotions: Promotion[] = [];

  constructor(params: {
    id?: string;
    name: string;
    price: number;
    category: string;
    visible?: boolean;
    promotions?: Promotion[];
  }) {
    this.id = params.id;
    this.name = params.name;
    this.price = params.price;
    this.category = params.category;
    this.visible = params.visible ?? true;
    this.promotions = params.promotions ?? [];
  }

  // Getters
  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getPrice() {
    return this.price;
  }
  getCategory() {
    return this.category;
  }
  isVisible() {
    return this.visible;
  }
  getPromotions() {
    return this.promotions;
  }

  // Setters
  setName(name: string) {
    this.name = name;
  }
  setPrice(price: number) {
    if (price < 0) throw new Error("Price cannot be negative");
    this.price = price;
  }
  setCategory(category: string) {
    this.category = category;
  }
  setVisible(visible: boolean) {
    this.visible = visible;
  }

  // Promoções
  addPromotion(promotion: Promotion) {
    this.promotions.push(promotion);
  }

  removePromotion(promotionId: string) {
    this.promotions = this.promotions.filter((p) => p.getId() !== promotionId);
  }
}
