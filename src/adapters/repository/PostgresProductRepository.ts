import prisma from "@/prisma/prisma"
import { ProductDTO } from "../../domain/dto/ProductDTO";
import type { ProductRepositoryPort } from "../../ports/repository/ProductRepositoryPort";
import type { Product } from "@/dist/prisma/client";

export class PostgresProductRepository implements ProductRepositoryPort {
  // findAll(): Promise<ProductDTO[]> {
  //   //
  // }

  // findById(id: string): Promise<ProductDTO | null> {
  //   //
  // }

  async save(product: Product): Promise<void> {
    await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        categoryId: "321312213312"
      }
    })
  }

  // delete(id: string): Promise<void> {
  //   //
  // }
}
