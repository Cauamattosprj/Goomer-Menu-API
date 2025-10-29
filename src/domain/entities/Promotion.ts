import { v4 as uuidv4 } from "uuid";
import { Product } from "./Product";
import { TimeRange } from "../value-objects/TimeRange";

export class Promotion {
  private id: string;
  private description: string;
  private discountPrice?: number;
  private discountPercentage?: number;
  private validDays: string[];
  private timeRange: TimeRange;
  private validUntil?: Date;
  private isExpired: boolean = false;
  private products: Product[] = [];
  

  constructor(params: {
    id?: string;
    description: string;
    discountPrice?: number;
    discountPercentage?: number;
    validDays: string[];
    timeRange: TimeRange;
    validUntil?: Date;
    isExpired?: boolean;
    products?: Product[];
  }) {
    this.id = params.id || uuidv4();
    this.description = params.description;
    this.discountPrice = params.discountPrice;
    this.discountPercentage = params.discountPercentage;
    this.validDays = params.validDays;
    this.timeRange = params.timeRange;
    this.validUntil = params.validUntil;
    this.isExpired = params.isExpired ?? false;
    this.products = params.products ?? [];
    this.validate();
  }

  private validate(): void {
    if (!this.discountPrice && !this.discountPercentage) {
      throw new Error(
        "Promotion must have either discountPrice or discountPercentage"
      );
    }
    if (this.discountPrice && this.discountPrice < 0) {
      throw new Error("Discount price cannot be negative");
    }
    if (
      this.discountPercentage &&
      (this.discountPercentage < 0 || this.discountPercentage > 100)
    ) {
      throw new Error("Discount percentage must be between 0 and 100");
    }
  }

  getId(): string {
    return this.id;
  }

  getDescription(): string {
    return this.description;
  }

  getDiscountPrice(): number | undefined {
    return this.discountPrice;
  }

  getDiscountPercentage(): number | undefined {
    return this.discountPercentage;
  }

  getValidDays(): string[] {
    return this.validDays;
  }

  getTimeRange(): TimeRange {
    return this.timeRange;
  }

  getValidHourStart(): number {
    return this.timeRange.getStart();
  }

  getValidHourEnd(): number {
    return this.timeRange.getEnd();
  }

  getValidUntil(): Date | undefined {
    return this.validUntil;
  }

  getIsExpired(): boolean {
    return this.isExpired;
  }

  getProducts(): Product[] {
    return this.products;
  }

  hasProduct(product: Product): boolean {
    return this.products.some((p) => p.getId() === product.getId());
  }

  setDescription(desc: string): void {
    this.description = desc;
  }

  setDiscountPrice(price: number): void {
    if (price < 0) throw new Error("Promotion price cannot be negative");
    this.discountPrice = price;
  }

  setDiscountPercentage(percent: number): void {
    if (percent < 0 || percent > 100)
      throw new Error("Promotion percentage must be between 0 and 100");
    this.discountPercentage = percent;
  }

  setValidDays(days: string[]): void {
    this.validDays = days;
  }

  setValidUntil(date: Date): void {
    this.validUntil = date;
  }

  setIsExpired(expired: boolean): void {
    this.isExpired = expired;
  }

  addProduct(product: Product): void {
    if (!this.products.includes(product)) {
      this.products.push(product);
    }
  }

  removeProduct(product: Product): void {
    this.products = this.products.filter((p) => p !== product);
  }
}
