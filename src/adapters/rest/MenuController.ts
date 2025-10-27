// adapters/rest/MenuController.ts
import { Router, type Request, type Response } from "express";
import { GetMenuWithProductsAndPromotionsUseCase } from "@/application/menu/GetMenuWithProductsAndPromotionsUseCase";
import type { ProductRepositoryPort } from "@/ports/repository/ProductRepositoryPort";
import { PostgresProductRepository } from "../repository/PostgresProductRepository";
import { ApiResponseDTO } from "@/domain/dto/ApiResponseDTO";
import { PromotionRepositoryPort } from "@/ports/repository/PromotionRepositoryPort";
import { PostgresPromotionRepository } from "../repository/PostgresPromotionRepository copy";

// Inicialização das dependências (pode ser movida para injeção de dependência)
const productRepository: ProductRepositoryPort = new PostgresProductRepository();
const promotionRepository: PromotionRepositoryPort = new PostgresPromotionRepository();
const getMenuWithProductsAndPromotionsUseCase = new GetMenuWithProductsAndPromotionsUseCase(
  productRepository,
  promotionRepository
);

export const menuRouter: Router = Router();

menuRouter.get("/menu", async (req: Request, res: Response) => {
  try {
    // Opcional: permitir customização do nome do menu via query param
    const menuName = (req.query.name as string) || "Menu Principal";
    
    const response = await getMenuWithProductsAndPromotionsUseCase.execute(menuName);
    
    res.status(200).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json(ApiResponseDTO.ofError(errorMessage));
  }
});