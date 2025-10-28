import { Router, type Request, type Response } from "express";
import { CreateCategoryUseCase } from "@/application/category/CreateCategoryUseCase";
import { GetCategoryUseCase } from "@/application/category/GetCategoryUseCase";
import { UpdateCategoryUseCase } from "@/application/category/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "@/application/category/DeleteCategoryUseCase";
import { PostgresCategoryRepository } from "../repository/PostgresCategoryRepository";
import type { CategoryRepositoryPort } from "@/ports/repository/CategoryRepositoryPort";
import { CategoryDTO } from "@/domain/dto/CategoryDTO";
import { ApiResponseDTO } from "@/domain/dto/ApiResponseDTO";

const categoryRepository: CategoryRepositoryPort = new PostgresCategoryRepository();
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const getCategoryUseCase = new GetCategoryUseCase(categoryRepository);
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

export const categoryRouter: Router = Router();

categoryRouter.post("/categories", async (req: Request, res: Response) => {
  try {
    const categoryDTO = req.body as CategoryDTO;
    const response: CategoryDTO = await createCategoryUseCase.execute(categoryDTO);
    res.status(201).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(400).json(ApiResponseDTO.ofError(errorMessage));
  }
});

categoryRouter.get("/categories/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response: CategoryDTO = await getCategoryUseCase.execute(id);
    res.status(200).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(404).json(ApiResponseDTO.ofError(errorMessage));
  }
});

categoryRouter.get("/categories", async (req: Request, res: Response) => {
  try {
    const categories = await categoryRepository.findAll();
    const response = categories.map(category => CategoryDTO.fromEntity(category));
    res.status(200).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json(ApiResponseDTO.ofError(errorMessage));
  }
});

categoryRouter.put("/categories/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryDTO = req.body as CategoryDTO;
    const response: CategoryDTO = await updateCategoryUseCase.execute(id, categoryDTO);
    res.status(200).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(400).json(ApiResponseDTO.ofError(errorMessage));
  }
});

categoryRouter.delete("/categories/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteCategoryUseCase.execute(id);
    res.status(204).send();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(400).json(ApiResponseDTO.ofError(errorMessage));
  }
});