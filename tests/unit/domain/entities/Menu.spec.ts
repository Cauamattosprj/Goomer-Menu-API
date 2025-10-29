import { Menu } from "@/domain/entities/Menu";
import { Product } from "@/domain/entities/Product";
import { Promotion } from "@/domain/entities/Promotion";

describe("Menu Entity", () => {
  let menu: Menu;
  let products: Product[];
  let promotions: Promotion[];

  beforeEach(() => {
    menu = new Menu({
      name: "Menu Principal",
    });

    products = [
      new Product({
        id: "prod-1",
        name: "Hambúrguer",
        price: 2500,
        categoryId: "cat-1",
        visible: true,
      }),
      new Product({
        id: "prod-2",
        name: "Refrigerante",
        price: 800,
        categoryId: "cat-2",
        visible: true,
      }),
      new Product({
        id: "prod-3",
        name: "Sobremesa",
        price: 1200,
        categoryId: "cat-1",
        visible: false,
      }),
    ];

    promotions = [
      new Promotion({
        id: "promo-1",
        description: "Promoção de Hambúrguer",
        discountPrice: 2000,
        validDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        validHourStart: 0,
        validHourEnd: 2359,
        products: [products[0]],
      }),
      new Promotion({
        id: "promo-2",
        description: "Promoção de Bebida",
        discountPercentage: 20,
        validDays: ["MON", "TUE", "WED"],
        validHourStart: 1400,
        validHourEnd: 1800,
        products: [products[1]],
      }),
    ];
  });

  describe("Constructor", () => {
    it("should create a menu with valid data", () => {
      expect(menu.getId()).toBeDefined();
      expect(menu.getName()).toBe("Menu Principal");
      expect(menu.getIsActive()).toBe(true);
    });

    it("should create a menu with custom id", () => {
      const customMenu = new Menu({
        id: "custom-id",
        name: "Menu Custom",
      });

      expect(customMenu.getId()).toBe("custom-id");
      expect(customMenu.getName()).toBe("Menu Custom");
    });

    it("should create an inactive menu", () => {
      const inactiveMenu = new Menu({
        name: "Menu Inativo",
        isActive: false,
      });

      expect(inactiveMenu.getIsActive()).toBe(false);
    });
  });

  describe("getMenuWithProductsAndPromotions", () => {
    it("should return menu with products and promotions", () => {
      const result = menu.getMenuWithProductsAndPromotions(
        products,
        promotions
      );

      expect(result.menuId).toBe(menu.getId());
      expect(result.menuName).toBe("Menu Principal");
      expect(result.items).toHaveLength(2);
    });

    it("should exclude invisible products", () => {
      const result = menu.getMenuWithProductsAndPromotions(
        products,
        promotions
      );

      const visibleProducts = result.items.map((item) =>
        item.product.getName()
      );
      expect(visibleProducts).toContain("Hambúrguer");
      expect(visibleProducts).toContain("Refrigerante");
      expect(visibleProducts).not.toContain("Sobremesa");
    });

    it("should apply discount price correctly", () => {
      const result = menu.getMenuWithProductsAndPromotions(
        products,
        promotions
      );

      const hamburgerItem = result.items.find(
        (item) => item.product.getName() === "Hambúrguer"
      );
      expect(hamburgerItem?.finalPrice).toBe(2000);
      expect(hamburgerItem?.activePromotion?.getId()).toBe("promo-1");
    });

    it("should apply discount percentage correctly", () => {
      const result = menu.getMenuWithProductsAndPromotions(
        [products[1]],
        [promotions[1]]
      );

      const drinkItem = result.items[0];
      expect(drinkItem.finalPrice).toBe(640);
      expect(drinkItem.activePromotion?.getId()).toBe("promo-2");
    });

    it("should not apply expired promotions", () => {
      const expiredPromotion = new Promotion({
        id: "expired-promo",
        description: "Promoção Expirada",
        discountPrice: 1000,
        validDays: ["MON", "TUE", "WED"],
        validHourStart: 0,
        validHourEnd: 2359,
        isExpired: true,
        products: [products[0]],
      });

      const result = menu.getMenuWithProductsAndPromotions(
        [products[0]],
        [expiredPromotion]
      );

      const item = result.items[0];
      expect(item.activePromotion).toBeNull();
      expect(item.finalPrice).toBe(2500);

      it("should not apply promotions outside valid hours", () => {
        const result = menu.getMenuWithProductsAndPromotions(
          [products[1]],
          [promotions[1]]
        );

        const item = result.items[0];
        expect(item.activePromotion).toBeNull();
        expect(item.finalPrice).toBe(800);
      });

      it("should not apply promotions outside valid days", () => {
        const result = menu.getMenuWithProductsAndPromotions(
          [products[1]],
          [promotions[1]]
        );

        const item = result.items[0];
        expect(item.activePromotion).toBeNull();
        expect(item.finalPrice).toBe(800);
      });

      it("should handle products without promotions", () => {
        const productWithoutPromotion = new Product({
          id: "prod-no-promo",
          name: "Produto Sem Promoção",
          price: 1500,
          visible: true,
        });

        const result = menu.getMenuWithProductsAndPromotions(
          [productWithoutPromotion],
          []
        );

        const item = result.items[0];
        expect(item.activePromotion).toBeNull();
        expect(item.finalPrice).toBe(1500);
      });

      it("should return original price when promotion has no discount", () => {
        const invalidPromotion = new Promotion({
          description: "Promoção Inválida",
          validDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
          validHourStart: 0,
          validHourEnd: 2359,
          products: [products[0]],
        });

        const result = menu.getMenuWithProductsAndPromotions(
          [products[0]],
          [invalidPromotion]
        );

        const item = result.items[0];
        expect(item.activePromotion).toBeDefined();
        expect(item.finalPrice).toBe(2500);
      });
    });

    describe("Promotion Priority", () => {
      it("should use the first valid promotion when multiple apply", () => {
        const extraPromotion = new Promotion({
          id: "promo-extra",
          description: "Promoção Extra",
          discountPrice: 1800,
          validDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
          validHourStart: 0,
          validHourEnd: 2359,
          products: [products[0]],
        });

        const result = menu.getMenuWithProductsAndPromotions(
          [products[0]],
          [promotions[0], extraPromotion]
        );

        const item = result.items[0];
        expect(item.activePromotion?.getId()).toBe("promo-1");
        expect(item.finalPrice).toBe(2000);
      });
    });

    describe("Edge Cases", () => {
      it("should handle empty products array", () => {
        const result = menu.getMenuWithProductsAndPromotions([], promotions);

        expect(result.items).toHaveLength(0);
      });

      it("should handle empty promotions array", () => {
        const result = menu.getMenuWithProductsAndPromotions(products, []);

        expect(result.items).toHaveLength(2);
        result.items.forEach((item) => {
          expect(item.activePromotion).toBeNull();
          expect(item.finalPrice).toBe(item.product.getPrice());
        });
      });

      it("should round final price correctly with percentage discount", () => {
        const product = new Product({
          name: "Produto Teste",
          price: 1999,
        });

        const promotion = new Promotion({
          description: "33% Off",
          discountPercentage: 33,
          validDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
          validHourStart: 0,
          validHourEnd: 2359,
          products: [product],
        });

        const result = menu.getMenuWithProductsAndPromotions(
          [product],
          [promotion],
        );

        expect(result.items[0].finalPrice).toBe(1339);
      });
    });

    describe("Time Calculation", () => {
      it("should calculate current day correctly", () => {
        const testDate = new Date("2025-10-26T12:00:00Z+03:00");
        const menuInstance = new Menu({ name: "Test" });

        const currentDay = menuInstance.getCurrentDay(testDate);
        expect(currentDay).toBe("SUN");
      });

      it("should calculate current time correctly", () => {
        const testDate = new Date("2025-10-26T14:30:00Z+03:00");
        const menuInstance = new Menu({ name: "Test" });

        const currentTime = menuInstance.getCurrentTime(testDate);
        expect(currentTime).toBe(1430);
      });
    });
  });
});
