export class Promotion {
  private id: string;
  private description: string;
  private promotionPrice?: number | undefined;
  private promotionPercentage?: number | undefined;
  private validDays: string[];
  private validHourStart: number[];
  private validHourEnd: number[];
  private validUntil?: Date | undefined;
  private isExpired: boolean = false;
  private productIds: string[] = [];

  constructor(params: {
    id: string;
    description: string;
    promotionPrice?: number;
    promotionPercentage?: number;
    validDays: string[];
    validHourStart: number[];
    validHourEnd: number[];
    validUntil?: Date;
    isExpired?: boolean;
  }) {
    this.id = params.id;
    this.description = params.description;
    this.promotionPrice = params.promotionPrice;
    this.promotionPercentage = params.promotionPercentage;
    this.validDays = params.validDays;
    this.validHourStart = params.validHourStart;
    this.validHourEnd = params.validHourEnd;
    this.validUntil = params.validUntil;
    this.isExpired = params.isExpired ?? false;
  }

  // Getters
  getId() {
    return this.id;
  }
  getDescription() {
    return this.description;
  }
  getPromotionPrice() {
    return this.promotionPrice;
  }
  getPromotionPercentage() {
    return this.promotionPercentage;
  }
  getValidDays() {
    return this.validDays;
  }
  getValidHourStart() {
    return this.validHourStart;
  }
  getValidHourEnd() {
    return this.validHourEnd;
  }
  getValidUntil() {
    return this.validUntil;
  }
  getIsExpired() {
    return this.isExpired;
  }
  getProductIds() {
    return this.productIds;
  }

  // Setters
  setDescription(desc: string) {
    this.description = desc;
  }
  setPromotionPrice(price: number) {
    this.promotionPrice = price;
  }
  setPromotionPercentage(percent: number) {
    this.promotionPercentage = percent;
  }
  setValidDays(days: string[]) {
    this.validDays = days;
  }
  setValidHours(start: number[], end: number[]) {
    this.validHourStart = start;
    this.validHourEnd = end;
  }
  setValidUntil(date: Date) {
    this.validUntil = date;
  }
  setIsExpired(expired: boolean) {
    this.isExpired = expired;
  }

  // Produtos
  addProduct(productId: string) {
    if (!this.productIds.includes(productId)) this.productIds.push(productId);
  }

  removeProduct(productId: string) {
    this.productIds = this.productIds.filter((id) => id !== productId);
  }
}
