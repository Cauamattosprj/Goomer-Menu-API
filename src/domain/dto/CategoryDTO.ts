import { Category } from "../entities/Category";

export interface ICategoryDTO {
  id?: string;
  name: string;
}

export class CategoryDTO implements ICategoryDTO {
  public id?: string;
  public name: string;

  constructor(params: { id?: string; name: string }) {
    this.id = params.id;
    this.name = params.name;
  }

  static fromEntity(category: Category): CategoryDTO {
    return new CategoryDTO({
      id: category.getId(),
      name: category.getName(),
    });
  }

  static toEntity(dto: ICategoryDTO): Category {
    return new Category({
      id: dto.id,
      name: dto.name,
    });
  }
}