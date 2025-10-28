import type { CategoryRepositoryPort } from "@/ports/repository/CategoryRepositoryPort";
import { CategoryDTO } from "@/domain/dto/CategoryDTO";

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepositoryPort) {}

  async execute(categoryDTO: CategoryDTO): Promise<CategoryDTO> {
    const category = CategoryDTO.toEntity(categoryDTO);
    await this.categoryRepository.save(category);
    return CategoryDTO.fromEntity(category);
  }
}