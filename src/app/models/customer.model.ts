export interface Customer {
    email: string;
    password: string;
    name: string;
    surname: string;
    address: string;
    contact: string;
    orders?: Array<OrderCustomer>;
    imageName: string;
    imageUrl: string;
    messages?: Array<Message>;
}

export interface OrderCustomer {
    products: Array<string>;
    date: Date | string;
    price: number;
}

export interface Message {
    date: Date | string;
    admin: string;
    subject?: string;
    message: string;
}
