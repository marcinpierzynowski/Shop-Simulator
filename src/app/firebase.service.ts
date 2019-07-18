import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { Customer } from './models/customer.model';
import { Product } from './models/product.model';
import { Notificactions, Reviews, Evaluation } from './models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public customersData: BehaviorSubject<Array<Customer>> = new BehaviorSubject(null);
  public productsData: BehaviorSubject<Array<Product>> = new BehaviorSubject(null);
  public reviewsData: BehaviorSubject<Array<Reviews>> = new BehaviorSubject(null);
  public evaluationsData: BehaviorSubject<Array<Evaluation>> = new BehaviorSubject(null);
  public notificationsData: BehaviorSubject<Notificactions> = new BehaviorSubject(null);

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
    this.getDataBaseRef('notifications').on('value', this.notifications.bind(this), this.catchError);
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

  public notifications(response): void {
    const data = response.val();

    if (data === null) {
      this.notificationsData.next(null);
      return;
    }

    const notifications = data;
    this.notificationsData.next(notifications);
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
