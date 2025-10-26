import { v4 as uuidv4 } from "uuid";
import { Product } from "./Product";

export class Promotion {
  private id: string;
  private description: string;
  private discountPrice?: number | undefined;
  private discountPercentage?: number | undefined;
  private validDays: string[];
  private validHourStart: number;
  private validHourEnd: number;
  private validUntil?: Date | undefined;
  private isExpired: boolean = false;
  private products: Product[] = [];

  constructor(params: {
    id?: string;
    description: string;
    discountPrice?: number;
    discountPercentage?: number;
    validDays: string[];
    validHourStart: number;
    validHourEnd: number;
    validUntil?: Date;
    isExpired?: boolean;
    products?: Product[];
  }) {
    this.id = params.id || uuidv4();
    this.description = params.description;
    this.discountPrice = params.discountPrice;
    this.discountPercentage = params.discountPercentage;
    this.validDays = params.validDays;
    this.validHourStart = params.validHourStart;
    this.validHourEnd = params.validHourEnd;
    this.validUntil = params.validUntil;
    this.isExpired = params.isExpired ?? false;
    this.products = params.products ?? [];
  }

  // Getters
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
  getValidHourStart(): number {
    return this.validHourStart;
  }
  getValidHourEnd(): number {
    return this.validHourEnd;
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

  // Método para verificar se um produto específico está na promoção
  // Na classe Promotion
  hasProduct(product: Product): boolean {
    return this.products.some((p) => p.getId() === product.getId());
  }

  hasProductById(productId: string): boolean {
    return this.products.some((product) => product.getId() === productId);
  }

  // Setters
  setDescription(desc: string): void {
    this.description = desc;
  }
  setDiscountPrice(price: number): void {
    if (price < 0) throw new Error("Promotion price cannot be negative");
    this.discountPrice = price;
  }

  setDiscountPercentage(percent: number): void {
    if (percent < 0) throw new Error("Promotion percentage cannot be negative");
    this.discountPercentage = percent;
  }

  setValidDays(days: string[]): void {
    this.validDays = days;
  }
  setValidHours(start: number, end: number): void {
    this.validHourStart = start;
    this.validHourEnd = end;
  }
  setValidUntil(date: Date): void {
    this.validUntil = date;
  }
  setIsExpired(expired: boolean): void {
    this.isExpired = expired;
  }

  // Produtos
  addProduct(product: Product): void {
    if (!this.products.includes(product)) {
      this.products.push(product);
    }
  }

  removeProduct(product: Product): void {
    this.products = this.products.filter((p) => p !== product);
  }

  removeProductById(productId: string): void {
    this.products = this.products.filter((p) => p.getId() !== productId);
  }
}
