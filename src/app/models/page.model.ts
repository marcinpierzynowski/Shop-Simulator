import { Product } from './product.model';

export interface Slider {
    imageUrl: string;
    name: string;
}

export interface Promotion {
    ref: string;
    title: string;
}

export interface Order {
    ref: string;
    name: string;
    surname: string;
    email: string;
    products: Array<Product>;
    data: string;
    country: string;
    city: string;
    address: string;
    url: string;
    price: string;
    executed: boolean;
}