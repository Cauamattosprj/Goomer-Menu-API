import { Router, type Request, type Response } from "express";
import { CreateProductUseCase } from "../../application/product/CreateProductUseCase";
import { GetProductUseCase } from "@/application/product/GetProductUseCase";
import { UpdateProductUseCase } from "@/application/product/UpdateProductUseCase";
import { DeleteProductUseCase } from "@/application/product/DeleteProductUseCase";
import { PostgresProductRepository } from "../repository/PostgresProductRepository";
import type { ProductRepositoryPort } from "../../ports/repository/ProductRepositoryPort";
import { ProductDTO } from "../../domain/dto/ProductDTO";
import { ApiResponseDTO } from "../../domain/dto/ApiResponseDTO";
import { ProductService } from "@/domain/services/ProductService";

const productRepository: ProductRepositoryPort = new PostgresProductRepository();
const productService = new ProductService(productRepository);
const createProductUseCase: CreateProductUseCase = new CreateProductUseCase(
  productRepository,
  productService
);
const getProductUseCase: GetProductUseCase = new GetProductUseCase(
  productRepository,
  productService
);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);

export const productRouter: Router = Router();

productRouter.post("/products", async (req: Request, res: Response) => {
  try {
    const productDTO = req.body as ProductDTO;
    const response: ProductDTO = await createProductUseCase.execute(productDTO);
    res.status(201).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(400).json(ApiResponseDTO.ofError(errorMessage));
  }
});

productRouter.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response: ProductDTO = await getProductUseCase.execute(id);
    res.status(200).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(404).json(ApiResponseDTO.ofError(errorMessage));
  }
});

productRouter.get("/products", async (req: Request, res: Response) => {
  try {
    const products = await productRepository.findAll();
    const response = products.map(product => ProductDTO.fromEntity(product));
    res.status(200).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json(ApiResponseDTO.ofError(errorMessage));
  }
});

productRouter.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productDTO = req.body as ProductDTO;
    const response: ProductDTO = await updateProductUseCase.execute(id, productDTO);
    res.status(200).json(ApiResponseDTO.ofSuccess(response));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(400).json(ApiResponseDTO.ofError(errorMessage));
  }
});

productRouter.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteProductUseCase.execute(id);
    res.status(204).send();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(400).json(ApiResponseDTO.ofError(errorMessage));
  }
});