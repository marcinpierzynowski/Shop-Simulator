export interface Admin {
    email: string;
    password: string;
    addProducts?: Array<CreatedProduct>;
    logins?: Array<Login>;
    realizedOrder?: Array<RealizedOrder>;
    detail: UserDetail;
    media?: SocialMedia;
    created_at: Date | string;
}

export interface UserDetail {
    name?: string;
    surname?: string;
    imageUrl: string;
    imageName?: string;
    city?: string;
    country?: string;
}

export interface SocialMedia {
    facebook: string;
    twitter: string;
    linkedIn: string;
}

export interface Login {
    data: Date | string;
    time: string;
    ip: string;
}

export interface CreatedProduct {
    data: Date | string;
    time: string;
    ref: string;
}

export interface RealizedOrder {
    data: Date | string;
    time: string;
    ref: string;
}
