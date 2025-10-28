import { Router, type Request, type Response } from "express";
import { GetMenuWithProductsAndPromotionsUseCase } from "@/application/menu/GetMenuWithProductsAndPromotionsUseCase";
import type { ProductRepositoryPort } from "@/ports/repository/ProductRepositoryPort";
import type { PromotionRepositoryPort } from "@/ports/repository/PromotionRepositoryPort";
import type { CategoryRepositoryPort } from "@/ports/repository/CategoryRepositoryPort";
import { PostgresProductRepository } from "../repository/PostgresProductRepository";
import { PostgresPromotionRepository } from "../repository/PostgresPromotionRepository copy";
import { PostgresCategoryRepository } from "../repository/PostgresCategoryRepository";
import { ApiResponseDTO } from "@/domain/dto/ApiResponseDTO";

const productRepository: ProductRepositoryPort =
  new PostgresProductRepository();
const promotionRepository: PromotionRepositoryPort =
  new PostgresPromotionRepository();
const categoryRepository: CategoryRepositoryPort =
  new PostgresCategoryRepository();
const getMenuWithProductsAndPromotionsUseCase =
  new GetMenuWithProductsAndPromotionsUseCase(
    productRepository,
    promotionRepository,
    categoryRepository
  );

export const menuRouter: Router = Router();

menuRouter.get("/menu", async (req: Request, res: Response) => {
  try {
    const menuName = (req.query.name as string) || "Menu Principal";

    const response = await getMenuWithProductsAndPromotionsUseCase.execute(
      menuName
    );

    res.status(200).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json(ApiResponseDTO.ofError(errorMessage));
  }
});
