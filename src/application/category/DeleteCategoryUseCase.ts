import type { CategoryRepositoryPort } from "@/ports/repository/CategoryRepositoryPort";

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: CategoryRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    await this.categoryRepository.delete(id);
  }
}