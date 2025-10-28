import { PostgresCategoryRepository } from "@/adapters/repository/PostgresCategoryRepository";
import { Product } from "../entities/Product";

export interface IProductDTO {
  id?: string;
  name: string;
  price: number;
  category?: {
    id?: string;
    name?: string;
  };
  categoryId?: string | null;
}

export class ProductDTO implements IProductDTO {
  public name: string;
  public price: number;
  public id?: string;
  public category?: { id?: string; name?: string };
  public categoryId?: string | null;

  constructor(params: {
    name: string;
    price: number;
    id?: string;
    category?: { id?: string; name?: string };
    categoryId?: string | null;
  }) {
    this.name = params.name;
    this.price = params.price;
    this.id = params.id;
    this.category = params.category;
    this.categoryId = params.categoryId;
  }

  static fromEntity(product: Product): ProductDTO {
    const categoryId = product.getCategoryId();

    let category: { id?: string; name?: string } | undefined;

    if (categoryId) {
      category = { id: categoryId };
    }

    return new ProductDTO({
      name: product.getName(),
      price: product.getPrice(),
      id: product.getId(),
      category: category,
      categoryId: categoryId,
    });
  }

  async withCategoryDetails(categoryRepository: PostgresCategoryRepository): Promise<ProductDTO> {
    if (this.categoryId && !this.category?.name) {
      const category = await categoryRepository.findById(this.categoryId);
      if (category) {
        this.category = {
          id: category.getId(),
          name: category.getName()
        };
      }
    }
    return this;
  }
}