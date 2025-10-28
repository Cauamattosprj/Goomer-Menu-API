import type { CategoryRepositoryPort } from "@/ports/repository/CategoryRepositoryPort";
import { CategoryDTO } from "@/domain/dto/CategoryDTO";

export class GetCategoryUseCase {
  constructor(private categoryRepository: CategoryRepositoryPort) {}

  async execute(id: string): Promise<CategoryDTO> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return CategoryDTO.fromEntity(category);
  }
}