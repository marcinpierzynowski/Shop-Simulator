import { Product } from './product.model';

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
