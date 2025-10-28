import type { CategoryRepositoryPort } from "@/ports/repository/CategoryRepositoryPort";
import { CategoryDTO } from "@/domain/dto/CategoryDTO";
import { Category } from "@/domain/entities/Category";

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepositoryPort) {}

  async execute(id: string, categoryDTO: CategoryDTO): Promise<CategoryDTO> {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error("Category not found");
    }

    const category = new Category({
      id: id,
      name: categoryDTO.name,
    });

    await this.categoryRepository.update(category);
    return CategoryDTO.fromEntity(category);
  }
}