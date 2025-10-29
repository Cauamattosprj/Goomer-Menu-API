import { v4 as uuidv4 } from "uuid";

export class Product {
  private id?: string | undefined;
  private name: string;
  private price: number;
  private categoryId?: string | null;
  private visible: boolean = true;

  constructor(params: {
    id?: string;
    name: string;
    price: number;
    categoryId?: string | null;
    visible?: boolean;
  }) {
    this.id = params.id;
    this.id ??= uuidv4();
    this.name = params.name;
    this.price = params.price;
    this.categoryId = params.categoryId;
    this.visible = params.visible ?? true;
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
  getCategoryId(): string | undefined | null {
    return this.categoryId;
  }
  isVisible(): boolean {
    return this.visible;
  }

  // Setters
  setName(name: string): void {
    this.name = name;
  }
  setPrice(price: number): void {
    if (price < 0) throw new Error("Price cannot be negative");
    this.price = price;
  }
  setCategoryId(category: string): void {
    this.categoryId = category;
  }
  setVisible(visible: boolean): void {
    this.visible = visible;
  }
}