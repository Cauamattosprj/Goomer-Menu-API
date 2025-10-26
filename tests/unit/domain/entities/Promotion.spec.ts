import { Product } from "@/domain/entities/Product";
import { Promotion } from "@/domain/entities/Promotion";

describe("Promotion entity", () => {
  let promotion: Promotion;
  let product1: Product;
  let product2: Product;

  beforeEach(() => {
    promotion = new Promotion({
      description: "Promoção de Verão",
      discountPrice: 299,
      validDays: ["MON", "TUE", "WED"],
      validHourStart: 900,
      validHourEnd: 1800,
    });

    product1 = new Product({name: "Produto 1", category: "Drinks", price: 1300})
    product2 = new Product({name: "Produto 2", category: "Prato principal", price: 2900})
  });

  it("should create a promotion object with valid data", () => {
    expect(promotion).toHaveProperty("description", "Promoção de Verão");
    expect(promotion).toHaveProperty("discountPrice", 299);
    expect(promotion).toHaveProperty("validDays", ["MON", "TUE", "WED"]);
    expect(promotion).toHaveProperty("validHourStart", 900);
    expect(promotion).toHaveProperty("validHourEnd", 1800);
    expect(promotion).toHaveProperty("isExpired", false);
    expect(promotion).toHaveProperty("products", []);
    expect(promotion.getId()).toBeDefined();
  });

  it("should get promotion object correctly", () => {
    expect(promotion.getDescription()).toBe("Promoção de Verão");
    expect(promotion.getDiscountPrice()).toBe(299);
    expect(promotion.getValidDays()).toEqual(["MON", "TUE", "WED"]);
    expect(promotion.getValidHourStart()).toBe(900);
    expect(promotion.getValidHourEnd()).toBe(1800);
    expect(promotion.getIsExpired()).toBe(false);
    expect(promotion.getProducts()).toEqual([]);
  });

  it("should update promotion object correctly", () => {
    promotion.setDescription("Promoção de Inverno");
    promotion.setDiscountPrice(399);
    promotion.setDiscountPercentage(2);
    promotion.setValidDays(["FRI", "SAT"]);
    promotion.setValidHours(1000, 2000);
    promotion.setValidUntil(new Date("2024-12-31"));
    promotion.setIsExpired(true);

    expect(promotion.getDescription()).toBe("Promoção de Inverno");
    expect(promotion.getDiscountPrice()).toBe(399);
    expect(promotion.getDiscountPercentage()).toBe(2);
    expect(promotion.getValidDays()).toEqual(["FRI", "SAT"]);
    expect(promotion.getValidHourStart()).toBe(1000);
    expect(promotion.getValidHourEnd()).toBe(2000);
    expect(promotion.getValidUntil()).toEqual(new Date("2024-12-31"));
    expect(promotion.getIsExpired()).toBe(true);
  });

  it("should not allow setting a negative promotion price", () => {
    expect(() => {
      promotion.setDiscountPrice(-10);
    }).toThrow();
  });

  it("should not allow setting a negative promotion percentage", () => {
    expect(() => {
      promotion.setDiscountPercentage(-1);
    }).toThrow();
  });

  it("should add and remove products correctly", () => {

    promotion.addProduct(product1);
    promotion.addProduct(product2);

    console.log("PRODUTOS EM PROMOÇÃO:", promotion.getProducts())

    expect(promotion.getProducts()).toEqual([product1, product2]);
    expect(promotion.getProducts()).toHaveLength(2);

    // Não deve adicionar duplicados
    promotion.addProduct(product1);
    expect(promotion.getProducts()).toHaveLength(2);

    promotion.removeProduct(product1);
    expect(promotion.getProducts()).toEqual([product2]);

    promotion.removeProduct(product2);
    expect(promotion.getProducts()).toEqual([]);
  });

  it("should create promotion with percentage instead of price", () => {
    const percentagePromotion = new Promotion({
      description: "Promoção de 20% off",
      discountPercentage: 20,
      validDays: ["THU", "FRI"],
      validHourStart: 1200,
      validHourEnd: 2200,
    });

    expect(percentagePromotion.getDiscountPercentage()).toBe(20);
    expect(percentagePromotion.getDiscountPrice()).toBeUndefined();
    expect(percentagePromotion.getDescription()).toBe("Promoção de 20% off");
  });

  it("should create promotion with validUntil date", () => {
    const expirationDate = new Date("2024-12-31");
    const expiringPromotion = new Promotion({
      description: "Promoção com validade",
      discountPrice: 25,
      validDays: ["SAT", "SUN"],
      validHourStart: 800,
      validHourEnd: 2300,
      validUntil: expirationDate,
    });

    expect(expiringPromotion.getValidUntil()).toEqual(expirationDate);
    expect(expiringPromotion.getIsExpired()).toBe(false);
  });

  it("should create promotion as expired", () => {
    const expiredPromotion = new Promotion({
      description: "Promoção Expirada",
      discountPrice: 15,
      validDays: ["MON"],
      validHourStart: 900,
      validHourEnd: 1700,
      isExpired: true,
    });

    expect(expiredPromotion.getIsExpired()).toBe(true);
  });

  it("should reconstruct promotion with existing ID", () => {
    const existingId = "existing-promo-id-123";
    const reconstructedPromotion = new Promotion({
      id: existingId,
      description: "Promoção Existente",
      discountPrice: 35,
      validDays: ["WED"],
      validHourStart: 1000,
      validHourEnd: 1900,
    });

    expect(reconstructedPromotion.getId()).toBe(existingId);
  });
});
