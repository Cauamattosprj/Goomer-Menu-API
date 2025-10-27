// adapters/rest/ProductController.ts
import { Router, type Request, type Response } from "express";
import { CreateProductUseCase } from "../../application/product/CreateProductUseCase";
import { PostgresProductRepository } from "../repository/PostgresProductRepository";
import type { ProductRepositoryPort } from "../../ports/repository/ProductRepositoryPort";
import { ProductDTO } from "../../domain/dto/ProductDTO";
import { ApiResponseDTO } from "../../domain/dto/ApiResponseDTO";
import { success } from "zod";
import { ProductService } from "@/domain/services/ProductService";
import { GetProductUseCase } from "@/application/product/GetProductUseCase";

const productRepository: ProductRepositoryPort =
  new PostgresProductRepository();
const productService = new ProductService(productRepository);
const createProductUseCase: CreateProductUseCase = new CreateProductUseCase(
  productRepository,
  productService
);
const getProductUseCase: GetProductUseCase = new GetProductUseCase(
  productRepository,
  productService
);

export const productRouter: Router = Router();

productRouter.post("/products", async (req: Request, res: Response) => {
  try {
    const productDTO = req.body as ProductDTO;
    const response: ProductDTO = await createProductUseCase.execute(productDTO);
    res.status(201).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    res.status(400).json({ error: errorMessage });
  }
});

productRouter.get("/products", async (req: Request, res: Response) => {
  try {
    const { id } = req.body as { id: string};
    const response: ProductDTO = await getProductUseCase.execute(id);
    res.status(201).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    res.status(400).json({ error: errorMessage });
  }
});
