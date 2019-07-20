export interface Notificaction {
    date: Date | string;
    reviews?: number;
    evaluations?: number;
    messages?: number;
}

export interface Reviews {
    desc: string;
    user: string;
    date: Date | string;
    ref: string;
    id: number;
}

export interface Evaluation {
    rate: number;
    date: Date | string;
    ref: string;
    id: number;
}
