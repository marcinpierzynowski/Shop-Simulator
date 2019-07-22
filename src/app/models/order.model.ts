import { Product } from './product.model';

export interface Order {
    products: Array<ProductData>;
    date: Date | string;
    price: number;
    email: string;
    name: string;
    surname: string;
    address: string;
    contact: string;
    url: string;
    ref: string;
    executed: boolean;
}

export interface ProductData {
    amount: number;
    ref: string;
    detail: Product;
    price: number;
}
