// adapters/rest/ProductController.ts
import { Router, type Request, type Response } from "express";
import { CreateProductUseCase } from "../../application/CreateProductUseCase";
import { PostgresProductRepository } from "../repository/PostgresProductRepository";
import type { ProductRepositoryPort } from "../../ports/repository/ProductRepositoryPort";
import { Product } from "../../domain/entities/Product";
import { ProductDTO } from "../../domain/dto/ProductDTO";
import { ApiResponseDTO } from "../../domain/dto/ApiResponseDTO";
import { success } from "zod";

const productRepository: ProductRepositoryPort =
  new PostgresProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);

export const productRouter = Router();

productRouter.post("/products", async (req: Request, res: Response) => {
  try {
    const productDTO: ProductDTO = req.body;
    const response = await createProductUseCase.execute(productDTO);
    res.status(201).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
