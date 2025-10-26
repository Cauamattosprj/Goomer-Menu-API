// adapters/rest/ProductController.ts
import { Router, type Request, type Response } from "express";
import { CreateProductUseCase } from "../../application/CreateProductUseCase";
import { PostgresProductRepository } from "../repository/PostgresProductRepository";
import type { ProductRepositoryPort } from "../../ports/repository/ProductRepositoryPort";
import { Product } from "../../domain/entities/Product";
import { ProductDTO } from "../../domain/dto/ProductDTO";
import { ApiResponseDTO } from "../../domain/dto/ApiResponseDTO";
import { success } from "zod";
import { ProductService } from "@/src/domain/services/ProductService";

const productRepository: ProductRepositoryPort =
  new PostgresProductRepository();
const createProductUseCase: CreateProductUseCase = new CreateProductUseCase(productRepository, new ProductService(productRepository));

export const productRouter: Router = Router();

productRouter.post("/products", async (req: Request, res: Response) => {
  try {
    const productDTO: ProductDTO = req.body;
    const response: ProductDTO  = await createProductUseCase.execute(productDTO);
    res.status(201).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
