export interface Notificaction {
    date: Date | string;
    reviews?: number;
    evaluations?: number;
    messages?: number;
}

export interface Reviews {
    desc: string;
    email: string;
    date: Date | string;
    ref: string;
    id: number;
    urlProduct: string;
    urlCustomer: string;
}

export interface Evaluation {
    email: string;
    rate: number;
    date: Date | string;
    ref: string;
    id: number;
    urlProduct: string;
    urlCustomer: string;
}
