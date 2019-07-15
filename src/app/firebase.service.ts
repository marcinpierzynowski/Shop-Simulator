import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';

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
  value: number;
}

export interface Message {
  date: Date | string;
  admin: string;
  subject?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public customersData: BehaviorSubject<Array<Customer>> = new BehaviorSubject(null);

  private firebaseShop: any;
  private isAuthorized: boolean;

  constructor() {
    const config = environment.configShop;
    this.firebaseShop = firebase.initializeApp(config);
    this.init();
  }

  public get firebase() { return this.firebaseShop; }

  public get authorization() { return this.isAuthorized; }

  public set authorization(flag: boolean) { this.isAuthorized = flag; }

  public getDataBaseRef(name: string) { return firebase.database().ref(name); }

  public init(): void {
    this.getDataBaseRef('customers').on('value', this.customers.bind(this), this.catchError);
  }

  public customers(response): void {
    const data = response.val();

    if (data === null) {
      this.customersData.next([]);
      return;
    }

    const customers = this.prepareData(data);
    this.customersData.next(customers);
  }

  public prepareData(data) {
    const keys = Object.keys(data);
    const preData = [];

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < keys.length; i++) {
      preData.push(data[keys[i]]);
    }
    return preData;
  }

  public catchError(error: string) {
    console.error(error);
  }
}
