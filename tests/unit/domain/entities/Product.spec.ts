import { Product } from "@/domain/entities/Product";
import { Promotion } from "@/domain/entities/Promotion";

describe("Product entity", () => {
  let product: Product;

  beforeEach(() => {
    product = new Product({
      name: "Cerveja",
      price: 899,
      category: "Bebidas",
    });
  });

  it("should create a product object with valid data", () => {
    expect(product).toHaveProperty("name", "Cerveja");
    expect(product).toHaveProperty("price", 899);
    expect(product).toHaveProperty("category", "Bebidas");
    expect(product).toHaveProperty("visible", true);
    expect(product).toHaveProperty("promotions", []);
  });
  it("should update product object correctly", () => {
    product.setName("Bebida 2");
    product.setPrice(799);
    product.setVisible(false);
    product.setCategory("Drinks");

    expect(product).toHaveProperty("name", "Bebida 2");
    expect(product).toHaveProperty("price", 799);
    expect(product).toHaveProperty("visible", false);
    expect(product).toHaveProperty("category", "Drinks");
  });
  it("should not allow setting a negative price", () => {
    expect(() => {
      product.setPrice(-12);
    }).toThrow();
  });
  it("should add promotions correctly", () => {
    const promotion: Promotion = new Promotion({
      description: "Promoção de bebidas de fim de semana!",
      validDays: ["SUN", "SAT"],
      validHourStart: 1300,
      validHourEnd: 1800,
    });
    const promotion2: Promotion = new Promotion({
      description: "Promoção de bebidas de semana!",
      validDays: ["WED", "THU"],
      validHourStart: 1300,
      validHourEnd: 1800,
    });

    product.addPromotion(promotion);
    product.addPromotion(promotion2);

    expect(product).toHaveProperty("promotions", [promotion, promotion2]);
  });
  it("should remove promotions correctly", () => {
    const promotion: Promotion = new Promotion({
      description: "Promoção de bebidas de fim de semana!",
      validDays: ["SUN", "SAT"],
      validHourStart: 1300,
      validHourEnd: 1800,
    });
    const promotion2: Promotion = new Promotion({
      description: "Promoção de bebidas de semana!",
      validDays: ["WED", "THU"],
      validHourStart: 1300,
      validHourEnd: 1800,
    });

    console.log("Promotion 1 ID:", promotion.getId());
    console.log("Promotion 2 ID:", promotion2.getId());

    product.addPromotion(promotion);
    product.addPromotion(promotion2);

    product.removePromotion(promotion.getId());
    expect(product.getPromotions()).toEqual([promotion2]);

    product.removePromotion(promotion2.getId());
    expect(product.getPromotions()).toEqual([]);
  });
});
