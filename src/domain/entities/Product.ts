import { Promotion } from "./Promotion";
import { v4 as uuidv4 } from "uuid";

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
    this.id ??= uuidv4();
    this.name = params.name;
    this.price = params.price;
    this.category = params.category;
    this.visible = params.visible ?? true;
    this.promotions = params.promotions ?? [];
  }

  // Getters
  getId(): string | undefined {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getPrice(): number {
    return this.price;
  }
  getCategory(): string {
    return this.category;
  }
  isVisible(): boolean {
    return this.visible;
  }
  getPromotions(): Array<Promotion> {
    return this.promotions;
  }

  // Setters
  setName(name: string): void {
    this.name = name;
  }
  setPrice(price: number): void {
    if (price < 0) throw new Error("Price cannot be negative");
    this.price = price;
  }
  setCategory(category: string): void {
    this.category = category;
  }
  setVisible(visible: boolean): void {
    this.visible = visible;
  }

  // Promoções
  addPromotion(promotion: Promotion): void {
    this.promotions.push(promotion);
  }

  removePromotion(promotionId: string): void {
    this.promotions = this.promotions.filter((promotion) => promotion.getId() !== promotionId);
  }
}
