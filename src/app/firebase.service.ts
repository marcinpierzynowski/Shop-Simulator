import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { Customer } from './models/customer.model';
import { Product } from './models/product.model';
import { Notificaction, Reviews, Evaluation } from './models/notification.model';
import { Message } from './models/message.model';
import { Order } from './models/order.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public customersData: BehaviorSubject<Array<Customer>> = new BehaviorSubject(null);
  public productsData: BehaviorSubject<Array<Product>> = new BehaviorSubject(null);
  public reviewsData: BehaviorSubject<Array<Reviews>> = new BehaviorSubject(null);
  public evaluationsData: BehaviorSubject<Array<Evaluation>> = new BehaviorSubject(null);
  public notificationData: BehaviorSubject<Notificaction> = new BehaviorSubject(null);
  public messagesData: BehaviorSubject<Array<Message>> = new BehaviorSubject(null);
  public ordersData: BehaviorSubject<Array<Order>> = new BehaviorSubject(null);

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
    this.getDataBaseRef('products').on('value', this.products.bind(this), this.catchError);
    this.getDataBaseRef('reviews').on('value', this.reviews.bind(this), this.catchError);
    this.getDataBaseRef('evaluations').on('value', this.evaluations.bind(this), this.catchError);
    this.getDataBaseRef('notification').on('value', this.notification.bind(this), this.catchError);
    this.getDataBaseRef('messages').on('value', this.messages.bind(this), this.catchError);
    this.getDataBaseRef('orders').on('value', this.orders.bind(this), this.catchError);
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

  public products(response): void {
    const data = response.val();

    if (data === null) {
      this.productsData.next([]);
      return;
    }

    const products = this.prepareData(data);
    this.productsData.next(products);
  }

  public reviews(response): void {
    const data = response.val();

    if (data === null) {
      this.reviewsData.next([]);
      return;
    }

    const reviews = this.prepareData(data);
    this.reviewsData.next(reviews);
  }

  public evaluations(response): void {
    const data = response.val();

    if (data === null) {
      this.evaluationsData.next([]);
      return;
    }

    const evaluations = this.prepareData(data);
    this.evaluationsData.next(evaluations);
  }

  public notification(response): void {
    const data = response.val();

    if (data === null) {
      this.notificationData.next(null);
      return;
    }

    const notification = data;
    this.notificationData.next(notification);
  }

  public messages(response): void {
    const data = response.val();

    if (data === null) {
      this.messagesData.next([]);
      return;
    }

    const messages = data;
    this.messagesData.next(messages);
  }

  public orders(response): void {
    const data = response.val();

    if (data === null) {
      this.ordersData.next([]);
      return;
    }

    const ordersData = this.prepareData(data);
    this.ordersData.next(ordersData);
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
