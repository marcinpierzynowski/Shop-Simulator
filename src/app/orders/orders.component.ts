import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { DatePipe } from '@angular/common';

import { Product } from '../models/product.model';

import swal from 'sweetalert2';
import { Customer } from '../models/customer.model';
import { Order, ProductData } from '../models/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  products: Array<Product>;
  customers: Array<Customer>;
  customer = '';
  count;
  order: Order = {
    products: [],
    date: '',
    price: 0,
    email: '',
    name: '',
    surname: '',
    address: '',
    contact: '',
    url: '',
    ref: '',
    executed: false
  };
  orders: Array<Order>;

  constructor(
    private firebaseService: FirebaseService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.order.products = [];
    this.firebaseService.productsData.subscribe(pr => {
      if (pr) {
        this.count = new Array(pr.length);
        this.products = pr;
      }
    });

    this.firebaseService.customersData.subscribe(c => {
      this.customers = c;
    });

    this.firebaseService.ordersData.subscribe(o => {
      this.orders = o;
    });
  }

  sendOrder() {
    if (!this.customer) {
      swal.fire('Zamówienie', 'Brak wybranego klienta', 'error');
      return;
    }
    if (this.order.products.length === 0) {
      swal.fire('Zamówienie', 'Brak wybranych produktów', 'error');
      return;
    }

    let price = 0;
    const customer = this.customers.find(c => c.email === this.customer);

    this.order.products.forEach((p) => {
      price += p.price;
    });
    this.order = {
      products: this.order.products,
      date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      price,
      email: customer.email,
      name: customer.name,
      surname: customer.surname,
      address: customer.address,
      contact: customer.contact,
      url: customer.imageUrl,
      ref: this.generateRandomNumber(),
      executed: false
    };
    this.orders.push(this.order);
    this.firebaseService.getDataBaseRef('orders').set(this.orders)
      .then(() => swal.fire('Zamówienie', 'Zamówienie zostało złożoen', 'success'));
  }

  public generateRandomNumber(): string {
    // tslint:disable-next-line:one-variable-per-declaration
    let ref, isUnique;

    if (this.orders.length > 0) {
      do {
        ref = this.getRandomNumber();
        isUnique = this.orders.find(ord => ord.ref === ref);
      } while (isUnique);
    } else {
      ref = this.getRandomNumber();
    }
    return ref;
  }

  public getRandomNumber(): string {
    let value = '';
    for (let i = 0; i < 9; i++) { value += (Math.floor(Math.random() * 9) + 1).toString(); }
    return value;
  }

  add(index) {
    if (!this.count[index]) {
      this.count[index] = 1;
    } else {
      ++this.count[index];
    }
    this.addProduct(index);
  }

  remove(index) {
    if (this.count) {
      if (this.count[index] === 0) {
        return;
      }
    }
    if (!this.count[index]) {
      this.count[index] = 0;
      return;
    } else {
      --this.count[index];
    }
    this.removeProduct(index);
  }

  addProduct(index: number) {
    const product: Product = this.products[index];
    if (this.order.products.some(pr => pr.ref === product.ref)) {
      const orderSingleProduct: ProductData = this.order.products.find(pr => pr.ref === product.ref);
      orderSingleProduct.amount += 1;
      orderSingleProduct.price += product.price;
    } else {
      this.order.products.push({
        amount: 1,
        ref: product.ref,
        detail: product,
        price: product.price
      });
    }
  }

  removeProduct(index) {
    const product: Product = this.products[index];
    const order = this.order.products.find(o => o.ref === product.ref);
    order.amount -= 1;
    order.price -= product.price;
    if (order.amount === 0) {
      this.order.products = this.order.products.filter(o => o.ref !== product.ref);
    }
  }

}
