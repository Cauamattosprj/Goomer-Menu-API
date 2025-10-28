export interface MenuItemDTO {
  id: string;
  name: string;
  price: number;
  finalPrice: number;
  category?: {
    id: string;
    name: string;
  };
  promotion?: {
    id: string;
    description: string;
    discountPercentage?: number;
    discountPrice?: number;
  };
}

export interface MenuDTO {
  menuId: string;
  menuName: string;
  items: MenuItemDTO[];
}