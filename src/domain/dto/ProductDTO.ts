export class ProductDTO {
    constructor(
        public id: string | undefined,
        public name: string,
        public price: number,
        public category: string,
        public visible?: boolean
    ) {
        
    }
}