export interface Message {
    email: string;
    date: Date | string;
    desc: string;
    read: boolean;
    id: number;
    name: string;
    surname: string;
    url: string;
    answer?: Answer;
}

export interface Answer {
    email: string;
    date: string;
    desc: string;
    url: string;
}
