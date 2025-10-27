// domain/dto/ProductDTO.ts
import { Product } from "../entities/Product";

export interface IProductDTO {
  id?: string;
  name: string;
  price: number;
  category?: {
    id?: string;
    name?: string;
  };
}

export class ProductDTO implements IProductDTO {
  constructor(
    public name: string,
    public price: number,
    public id?: string,
    public category?: { id?: string; name?: string }
  ) {}

  static fromEntity(product: Product): ProductDTO {
    const categoryId = product.getCategoryId();
    
    let category: { id?: string; name?: string } | undefined;
    
    if (categoryId) {
      category = { id: categoryId };
    }

    return new ProductDTO(
      product.getName(),
      product.getPrice(),
      product.getId(),
      category
    );
  }
}
