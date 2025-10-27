export class Category {
  private id: string;
  private name: string;
  
  constructor(params: { id: string; name: string }) {
    this.id = params.id;
    this.name = params.name;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public setName(name: string): void {
    this.name = name;
  }
}
