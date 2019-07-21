import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { FirebaseService } from '../firebase.service';
import { Product, Reviews as RP } from '../models/product.model';
import { Customer } from '../models/customer.model';
import { Notificaction, Reviews, Evaluation } from '../models/notification.model';

import swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  public products: Array<Product>;
  public cpProducts: Array<Product>;
  public evaluation = 1;
  public customers: Array<Customer>;
  public customer = '';

  public notification: Notificaction;
  public reviews: Array<Reviews>;
  public evaluations: Array<Evaluation>;

  public desc = '';

  constructor(
    private firebaseService: FirebaseService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.firebaseService.productsData.subscribe(pr => {
      this.products = pr;
      if (pr) {
        this.cpProducts = pr.slice();
      }
    });

    this.firebaseService.customersData.subscribe(c => {
      this.customers = c;
    });

    this.firebaseService.evaluationsData.subscribe(c => {
      this.evaluations = c;
    });

    this.firebaseService.reviewsData.subscribe(c => {
      this.reviews = c;
    });

    this.firebaseService.notificationData.subscribe(c => {
      this.notification = c;
    });
  }

  public filter(e): void {
    const ref: string = e.value;
    this.cpProducts = this.products.filter(pr => pr.ref.toLowerCase().includes(ref.toLowerCase()));
  }

  setEval(e) {
    this.evaluation = (parseInt(e.target.value, 0));
  }

  public addEvaluation(ref: string): void {
    const product: Product = this.cpProducts.find(p => p.ref === ref);
    const indexPr = this.products.findIndex(p => p.ref === ref).toString();
    const data = {
      evaluation: this.evaluation,
      prevEvaluations: [this.evaluation]
    };
    if (product.reviewsCustomer) {
      if (product.reviewsCustomer.evaluations) {
        data.prevEvaluations = [...product.reviewsCustomer.evaluations.prevEvaluations, ...data.prevEvaluations];
        let value = 0;
        data.prevEvaluations.forEach(prev => {
          value += prev;
        });
        data.evaluation = value / data.prevEvaluations.length;
      }
    }
    this.firebaseService.getDataBaseRef('products').
      child(indexPr).child('reviewsCustomer').child('evaluations').set(data)
      .then(() => swal.fire('Dodanie oceny', 'Ocena została dodana', 'success'));
    this.addEvalData(product);
  }

  public addEvalData(product: Product) {
    const cust = this.customers.find(c => c.email === this.customer);
    const { ref, image } = product;
    const id = this.evaluations.length === 0 ? 1 : this.evaluations[this.evaluations.length - 1].id + 1;
    this.evaluations.push({
      rate: this.evaluation,
      ref,
      id,
      date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      urlProduct: image.url,
      urlCustomer: cust.imageUrl,
      email: cust.email
    });

    this.firebaseService.getDataBaseRef('evaluations').set(this.evaluations);
    if (!this.notification) {
      this.notification = {
        ...this.notification,
        date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        evaluations: 1
      };
    } else {
      if (!this.notification.evaluations) {
        this.notification = {
          ...this.notification,
          date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          evaluations: 1
        };
      } else {
        this.notification.evaluations += 1;
        this.notification.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      }
    }
    this.firebaseService.getDataBaseRef('notification').set(this.notification);
  }

  public addOpinion(ref: string): void {
    const cust = this.customers.find(c => c.email === this.customer);
    const data: RP = {
      amount: 1,
      desc: [{
        email: this.customer,
        date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        desc: this.desc,
        url: cust.imageUrl
      }]
    };

    const prod = this.products.find(p => p.ref === ref);
    const indexPr = this.products.findIndex(p => p.ref === ref).toString();
    if (prod.reviewsCustomer) {
      if (prod.reviewsCustomer.reviews) {
        data.amount += prod.reviewsCustomer.reviews.amount;
        data.desc = [...prod.reviewsCustomer.reviews.desc, ...data.desc];
      }
    }
    this.firebaseService.getDataBaseRef('products')
      .child(indexPr).child('reviewsCustomer').child('reviews').set(data)
      .then(() => swal.fire('Dodanie opinii', 'Opinia została dodana', 'success'));
    this.addOpinionData(this.desc, cust, prod);
  }

  public addOpinionData(desc, user, product: Product) {
    const { ref, image } = product;
    const id = this.reviews.length === 0 ? 1 : this.reviews[this.reviews.length - 1].id + 1;
    this.reviews.push({
      desc,
      ref,
      id,
      date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      urlProduct: image.url,
      urlCustomer: user.imageUrl,
      email: user.email
    });

    this.firebaseService.getDataBaseRef('reviews').set(this.reviews);

    if (!this.notification) {
      this.notification = {
        ...this.notification,
        reviews: 1,
        date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      };
    } else {
      if (!this.notification.reviews) {
        this.notification = {
          ...this.notification,
          reviews: 1,
          date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        };
      } else {
        this.notification.reviews += 1;
        this.notification.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      }
      this.firebaseService.getDataBaseRef('notification').set(this.notification);
    }
  }
}
