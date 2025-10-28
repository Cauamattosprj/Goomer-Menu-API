import { v4 as uuidv4 } from "uuid";

export class Category {
  private id: string;
  private name: string;

  constructor(params: { id?: string; name: string }) {
    this.id = params.id || uuidv4();
    this.name = params.name;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }
}