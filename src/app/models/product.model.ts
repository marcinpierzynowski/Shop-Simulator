export enum StatusProduct {
    Complete,
    Idle
}

export interface AddProduct {
    status: StatusProduct;
}

export interface Product {
    name: string;
    subject: string;
    categoryID?: number;
    categoryName: string;
    price: number;
    promotion: number;
    desc: string;
    metaTitle?: string;
    metaKeyword?: string;
    ref: string;
    params?: Array<ParamsProduct>;
    image?: Image;
    date: Date | string;
    reviewsCustomer?: ReviewsCustomers;
}

export interface ParamsProduct {
    name: string;
    value: string;
}

export interface Category {
    name: string;
    id: number;
}

export interface Image {
    id: number;
    name: string;
    url?: string;
}

export interface ReviewsCustomers {
    evaluations?: Evaluation;
    reviews?: Reviews;
}

export interface Evaluation {
    evaluation: number;
    prevEvaluations: Array<number>;
}

export interface Reviews {
    amount: number;
    desc: Array<ReviewData>;
}

export interface ReviewData {
    email: string;
    date: Date | string;
    desc: string;
    url: string;
}
