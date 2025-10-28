import { Promotion } from "../entities/Promotion";
import { TimeRange } from "../value-objects/TimeRange";
import { ProductDTO } from "./ProductDTO";
import { Product } from "../entities/Product";

export interface IPromotionDTO {
  id?: string;
  description: string;
  discountPrice?: number;
  discountPercentage?: number;
  validDays: string[];
  timeRange: {
    start: string;
    end: string;
  };
  validUntil?: Date;
  isExpired?: boolean;
  products?: ProductDTO[];
}

export class PromotionDTO implements IPromotionDTO {
  public id?: string;
  public description: string;
  public discountPrice?: number;
  public discountPercentage?: number;
  public validDays: string[];
  public timeRange: { start: string; end: string };
  public validUntil?: Date;
  public isExpired?: boolean;
  public products?: ProductDTO[];

  constructor(params: IPromotionDTO) {
    this.id = params.id;
    this.description = params.description;
    this.discountPrice = params.discountPrice;
    this.discountPercentage = params.discountPercentage;
    this.validDays = params.validDays;
    this.timeRange = params.timeRange;
    this.validUntil = params.validUntil;
    this.isExpired = params.isExpired ?? false;
    this.products = params.products;
  }

  static fromEntity(promotion: Promotion): PromotionDTO {
    return new PromotionDTO({
      id: promotion.getId(),
      description: promotion.getDescription(),
      discountPrice: promotion.getDiscountPrice(),
      discountPercentage: promotion.getDiscountPercentage(),
      validDays: promotion.getValidDays(),
      timeRange: {
        start: this.formatTime(promotion.getTimeRange().getStart()),
        end: this.formatTime(promotion.getTimeRange().getEnd()),
      },
      validUntil: promotion.getValidUntil(),
      isExpired: promotion.getIsExpired(),
      products: promotion.getProducts().map(product => ProductDTO.fromEntity(product)),
    });
  }

  static toEntity(dto: IPromotionDTO, products: Product[]): Promotion {
    const timeRange = new TimeRange(dto.timeRange.start, dto.timeRange.end);
    
    return new Promotion({
      id: dto.id,
      description: dto.description,
      discountPrice: dto.discountPrice,
      discountPercentage: dto.discountPercentage,
      validDays: dto.validDays,
      timeRange: timeRange,
      validUntil: dto.validUntil,
      isExpired: dto.isExpired,
      products: products,
    });
  }

  private static formatTime(timeNumber: number): string {
    const hours = Math.floor(timeNumber / 100);
    const minutes = timeNumber % 100;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}