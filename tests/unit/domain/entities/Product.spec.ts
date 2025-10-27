import { Product } from "@/domain/entities/Product";
import { Promotion } from "@/domain/entities/Promotion";

describe("Product entity", () => {
  let product: Product;

  beforeEach(() => {
    product = new Product({
      name: "Cerveja",
      price: 899,
    });
  });

  it("should create a product object with valid data", () => {
    expect(product).toHaveProperty("name", "Cerveja");
    expect(product).toHaveProperty("price", 899);
    expect(product).toHaveProperty("category", "Bebidas");
    expect(product).toHaveProperty("visible", true);
  });
  it("should update product object correctly", () => {
    product.setName("Bebida 2");
    product.setPrice(799);
    product.setVisible(false);

    expect(product).toHaveProperty("name", "Bebida 2");
    expect(product).toHaveProperty("price", 799);
    expect(product).toHaveProperty("visible", false);
  });
  it("should not allow setting a negative price", () => {
    expect(() => {
      product.setPrice(-12);
    }).toThrow();
  });

});
