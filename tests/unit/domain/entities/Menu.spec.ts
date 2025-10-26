import { Menu } from "@/domain/entities/Menu";
import { Product } from "@/domain/entities/Product";
import { Promotion } from "@/domain/entities/Promotion";
import { PromotionProductService } from "@/domain/services/PromotionProductService";

describe("Menu entity", () => {
  let menu: Menu;
  let products: Product[];
  let promotions: Promotion[];

  beforeEach(() => {
    menu = new Menu({
      name: "Cardápio Principal",
      description: "Cardápio completo do restaurante",
    });

    products = [
      new Product({
        name: "Cerveja Artesanal",
        price: 2500, 
        category: "Bebidas",
        visible: true,
      }),
      new Product({
        name: "Porção de Batata Frita",
        price: 1800,
        category: "Entradas",
        visible: true,
      }),
      new Product({
        name: "Filé Mignon",
        price: 4500,
        category: "Pratos principais",
        visible: true,
      }),
      new Product({
        name: "Tiramisu",
        price: 2200, // R$ 22,00
        category: "Sobremesas",
        visible: true,
      }),
      new Product({
        name: "Produto Invisível",
        price: 1500,
        category: "Entradas",
        visible: false, 
      }),
    ];

    promotions = [
      new Promotion({
        description: "Happy Hour - Cerveja 50% off",
        discountPercentage: 0.5,  
        validDays: ["MON", "TUE", "WED", "THU", "FRI"],
        validHourStart: 1700, // 17:00
        validHourEnd: 1900, 
        isExpired: false,
      }),
      new Promotion({
        description: "Promoção de Segunda",
        discountPrice: 1500,
        validDays: ["MON"],
        validHourStart: 1200, 
        validHourEnd: 1500, 
        isExpired: false,
      }),
      new Promotion({
        description: "Promoção Expirada",
        discountPercentage: 0.3,
        validDays: ["SUN", "SAT"],
        validHourStart: 1400,
        validHourEnd: 1800,
        isExpired: true, 
      }),
    ];

    PromotionProductService.associatePromotionWithProduct(
      promotions[0],
      products[0]
    );
    PromotionProductService.associatePromotionWithProduct(
      promotions[1],
      products[1]
    );
  });

  it("should return a valid menu object", () => {
    expect(menu.getId()).toBeDefined();
    expect(menu.getName()).toBe("Cardápio Principal");
    expect(menu.getDescription()).toBe("Cardápio completo do restaurante");
    expect(menu.getIsActive()).toBe(true);
    expect(menu.getCreatedAt()).toBeInstanceOf(Date);
    expect(menu.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it("should return a valid menu object with categories, products and promotions", () => {
    const testMenu = new Menu({
      name: "Cardápio Principal",
      description: "Cardápio completo do restaurante",
    });

    const originalUpdatedAt = testMenu.getUpdatedAt();

    const mockDate = new Date("2024-01-15T18:30:00");
    const dateSpy = jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate);

    const consolidatedMenu = testMenu.getConsolidatedMenu(products, promotions);

    dateSpy.mockRestore();

    expect(consolidatedMenu.menuId).toBeDefined();
    expect(consolidatedMenu.menuName).toBe("Cardápio Principal");
    expect(consolidatedMenu.categories).toHaveProperty("Bebidas");
    expect(consolidatedMenu.categories).toHaveProperty("Entradas");
    expect(consolidatedMenu.categories).toHaveProperty("Pratos principais");
    expect(consolidatedMenu.categories).toHaveProperty("Sobremesas");

    expect(consolidatedMenu.lastUpdated).toBe(originalUpdatedAt);

    expect(consolidatedMenu.categories["Bebidas"]).toHaveLength(1);
    expect(consolidatedMenu.categories["Entradas"]).toHaveLength(1);
    expect(consolidatedMenu.categories["Pratos principais"]).toHaveLength(1);
    expect(consolidatedMenu.categories["Sobremesas"]).toHaveLength(1);
  });

  it("should return a menu without products with visible set to false", () => {
    const consolidatedMenu = menu.getConsolidatedMenu(products, promotions);

    const allProducts = Object.values(consolidatedMenu.categories).flat();
    const invisibleProduct = allProducts.find(
      (item) => item.product.getName() === "Produto Invisível"
    );

    expect(invisibleProduct).toBeUndefined();

    expect(consolidatedMenu.categories["Entradas"]).toHaveLength(1);
    expect(consolidatedMenu.categories["Entradas"][0].product.getName()).toBe(
      "Porção de Batata Frita"
    );
  });

  it("should apply promotions only during valid days and hours", () => {
    const mondayEvening = new Date("2024-01-15T18:30:00");
    let consolidatedMenu = menu.getConsolidatedMenu(
      products,
      promotions,
      mondayEvening
    );
    let beerItem = consolidatedMenu.categories["Bebidas"][0];

    expect(beerItem.activePromotion).toBeDefined();
    expect(beerItem.activePromotion?.getDescription()).toBe(
      "Happy Hour - Cerveja 50% off"
    );
    expect(beerItem.finalPrice).toBe(1250);

    const mondayNight = new Date("2024-01-15T20:00:00");
    consolidatedMenu = menu.getConsolidatedMenu(
      products,
      promotions,
      mondayNight
    );
    beerItem = consolidatedMenu.categories["Bebidas"][0];

    expect(beerItem.activePromotion).toBeNull();
    expect(beerItem.finalPrice).toBe(2500);
  });

  it("should not apply expired promotions", () => {
    const sundayAfternoon = new Date("2024-01-14T16:00:00"); 
    jest.spyOn(global, "Date").mockImplementation(() => sundayAfternoon);

    const consolidatedMenu = menu.getConsolidatedMenu(products, promotions);

    const allItems = Object.values(consolidatedMenu.categories).flat();
    const itemsWithExpiredPromo = allItems.filter(
      (item) => item.activePromotion?.getDescription() === "Promoção Expirada"
    );

    expect(itemsWithExpiredPromo).toHaveLength(0);

    jest.restoreAllMocks();
  });

  it("should calculate final price correctly for discount percentage", () => {
    const mondayEvening = new Date("2024-01-15T18:30:00");
    jest.spyOn(global, "Date").mockImplementation(() => mondayEvening);

    const consolidatedMenu = menu.getConsolidatedMenu(products, promotions);
    const beerItem = consolidatedMenu.categories["Bebidas"][0];

    expect(beerItem.finalPrice).toBe(1250);

    jest.restoreAllMocks();
  });

  it("should calculate final price correctly for fixed discount price", () => {
    const mondayLunch = new Date("2024-01-15T13:00:00"); 
    jest.spyOn(global, "Date").mockImplementation(() => mondayLunch);

    const consolidatedMenu = menu.getConsolidatedMenu(products, promotions);
    const friesItem = consolidatedMenu.categories["Entradas"][0];

    expect(friesItem.finalPrice).toBe(1500);

    jest.restoreAllMocks();
  });

  it("should return original price when no active promotion exists", () => {
    const fridayNight = new Date("2024-01-19T21:00:00");
    jest.spyOn(global, "Date").mockImplementation(() => fridayNight);

    const consolidatedMenu = menu.getConsolidatedMenu(products, promotions);
    const steakItem = consolidatedMenu.categories["Pratos principais"][0];
    const dessertItem = consolidatedMenu.categories["Sobremesas"][0];

    expect(steakItem.activePromotion).toBeNull();
    expect(steakItem.finalPrice).toBe(4500); 
    expect(dessertItem.activePromotion).toBeNull();
    expect(dessertItem.finalPrice).toBe(2200); 

    jest.restoreAllMocks();
  });

  it("should handle empty products and promotions arrays", () => {
    const emptyProducts: Product[] = [];

    const consolidatedMenu = menu.getConsolidatedMenu(
      emptyProducts,
      promotions
    );

    expect(consolidatedMenu.categories).toEqual({});
    expect(consolidatedMenu.menuId).toBeDefined();
    expect(consolidatedMenu.menuName).toBe("Cardápio Principal");
  });

  it("should update menu properties correctly", () => {
    const originalUpdatedAt = menu.getUpdatedAt();

    setTimeout(() => {
      menu.setName("Novo Cardápio");
      menu.setDescription("Descrição atualizada");
      menu.setIsActive(false);

      expect(menu.getName()).toBe("Novo Cardápio");
      expect(menu.getDescription()).toBe("Descrição atualizada");
      expect(menu.getIsActive()).toBe(false);
      expect(menu.getUpdatedAt().getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    }, 10);
  });

  it("should group products by category correctly", () => {
    const consolidatedMenu = menu.getConsolidatedMenu(products, promotions);

    expect(Object.keys(consolidatedMenu.categories)).toEqual([
      "Bebidas",
      "Entradas",
      "Pratos principais",
      "Sobremesas",
    ]);

    expect(consolidatedMenu.categories["Bebidas"][0].product.getName()).toBe(
      "Cerveja Artesanal"
    );
    expect(consolidatedMenu.categories["Entradas"][0].product.getName()).toBe(
      "Porção de Batata Frita"
    );
    expect(
      consolidatedMenu.categories["Pratos principais"][0].product.getName()
    ).toBe("Filé Mignon");
    expect(consolidatedMenu.categories["Sobremesas"][0].product.getName()).toBe(
      "Tiramisu"
    );
  });

  it("should handle products without category", () => {
    const productWithoutCategory = new Product({
      name: "Produto Sem Categoria",
      price: 1000,
      category: "",
      visible: true,
    });

    const productWithoutCategory2 = new Product({
      name: "Produto Sem Categoria",
      price: 1000,
      category: "",
      visible: true,
    });

    const consolidatedMenu = menu.getConsolidatedMenu(
      [productWithoutCategory, productWithoutCategory2],
      promotions
    );

    expect(consolidatedMenu.categories).toEqual({});
  });

  it("DEBUG: should verify promotion associations", () => {
    expect(promotions[0].getProducts()).toHaveLength(1);
    expect(promotions[1].getProducts()).toHaveLength(1);
    expect(promotions[0].hasProduct(products[0])).toBe(true);
    expect(promotions[1].hasProduct(products[1])).toBe(true);
  });
});
