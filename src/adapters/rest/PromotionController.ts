import { Router, type Request, type Response } from "express";
import { CreatePromotionUseCase } from "@/application/promotion/CreatePromotionUseCase";
import { GetPromotionUseCase } from "@/application/promotion/GetPromotionUseCase";
import { AddProductsToPromotionUseCase } from "@/application/promotion/AddProductsToPromotionUseCase";
import { RemoveProductsFromPromotionUseCase } from "@/application/promotion/RemoveProductsFromPromotionUseCase";
import { PostgresProductRepository } from "../repository/PostgresProductRepository";
import type { PromotionRepositoryPort } from "@/ports/repository/PromotionRepositoryPort";
import type { ProductRepositoryPort } from "@/ports/repository/ProductRepositoryPort";
import { PromotionDTO } from "@/domain/dto/PromotionDTO";
import { ApiResponseDTO } from "@/domain/dto/ApiResponseDTO";
import { PostgresPromotionRepository } from "../repository/PostgresPromotionRepository copy";

const promotionRepository: PromotionRepositoryPort = new PostgresPromotionRepository();
const productRepository: ProductRepositoryPort = new PostgresProductRepository();
const createPromotionUseCase = new CreatePromotionUseCase(promotionRepository, productRepository);
const getPromotionUseCase = new GetPromotionUseCase(promotionRepository);
const addProductsToPromotionUseCase = new AddProductsToPromotionUseCase(promotionRepository, productRepository);
const removeProductsFromPromotionUseCase = new RemoveProductsFromPromotionUseCase(promotionRepository, productRepository);

export const promotionRouter: Router = Router();

promotionRouter.post("/promotions", async (req: Request, res: Response) => {
  try {
    const promotionDTO = req.body as PromotionDTO;
    const response: PromotionDTO = await createPromotionUseCase.execute(promotionDTO);
    res.status(201).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(400).json(ApiResponseDTO.ofError(errorMessage));
  }
});

promotionRouter.get("/promotions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response: PromotionDTO = await getPromotionUseCase.execute(id);
    res.status(200).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(404).json(ApiResponseDTO.ofError(errorMessage));
  }
});

promotionRouter.get("/promotions", async (req: Request, res: Response) => {
  try {
    const promotions = await promotionRepository.findActivePromotions();
    const response = promotions.map(promotion => PromotionDTO.fromEntity(promotion));
    res.status(200).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json(ApiResponseDTO.ofError(errorMessage));
  }
});

promotionRouter.post("/promotions/:id/products", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { productIds } = req.body as { productIds: string[] };
    
    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json(ApiResponseDTO.ofError("productIds must be an array"));
    }

    const response: PromotionDTO = await addProductsToPromotionUseCase.execute(id, productIds);
    res.status(200).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(400).json(ApiResponseDTO.ofError(errorMessage));
  }
});

promotionRouter.delete("/promotions/:id/products", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { productIds } = req.body as { productIds: string[] };
    
    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json(ApiResponseDTO.ofError("productIds must be an array"));
    }

    const response: PromotionDTO = await removeProductsFromPromotionUseCase.execute(id, productIds);
    res.status(200).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(400).json(ApiResponseDTO.ofError(errorMessage));
  }
});

promotionRouter.put("/promotions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const promotionDTO = req.body as PromotionDTO;
    promotionDTO.id = id;

    const productIds = promotionDTO.products?.map(p => p.id).filter((id): id is string => !!id) || [];
    const products = await Promise.all(
      productIds.map(productId => productRepository.findById(productId))
    );
    
    const validProducts = products.filter((p): p is NonNullable<typeof p> => p !== null);
    
    const promotion = PromotionDTO.toEntity(promotionDTO, validProducts);
    await promotionRepository.save(promotion);
    
    const response = PromotionDTO.fromEntity(promotion);
    res.status(200).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(400).json(ApiResponseDTO.ofError(errorMessage));
  }
});

promotionRouter.delete("/promotions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await promotionRepository.delete(id);
    res.status(204).send();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(400).json(ApiResponseDTO.ofError(errorMessage));
  }
});