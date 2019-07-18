import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Product, Evaluation as EvP, Reviews as RP } from '../models/product.model';
import swal from 'sweetalert2';
import { Customer } from '../models/customer.model';
import { DatePipe } from '@angular/common';
import { Notificactions, Reviews, Evaluation } from '../models/notification.model';

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

  public notifications: Notificactions;
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

    this.firebaseService.notificationsData.subscribe(c => {
      this.notifications = c;
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
    this.addEvalData(data.evaluation, ref);  
  }

  public addEvalData(rate, ref) {
    const id = this.evaluations.length === 0 ? 1 : this.evaluations[this.evaluations.length - 1].id + 1;
    this.evaluations.push({
      rate,
      ref,
      id,
      date: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });

    this.firebaseService.getDataBaseRef('evaluations').set(this.evaluations);
    this.notifications.evaluations += 1;
    this.firebaseService.getDataBaseRef('notifications').set(this.notifications);
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
        data.amount += data.amount;
        data.desc = [...prod.reviewsCustomer.reviews.desc, ...data.desc];
      }
    }
    this.firebaseService.getDataBaseRef('products')
      .child(indexPr).child('reviewsCustomer').child('reviews').set(data)
      .then(() => swal.fire('Dodanie opinii', 'Opinia została dodana', 'success'));
    this.addOpinionData(this.desc, this.customer, ref);
  }

  public addOpinionData(desc, user, ref) {
    const id = this.reviews.length === 0 ? 1 : this.reviews[this.reviews.length - 1].id + 1;
    this.reviews.push({
      desc,
      user,
      ref,
      id,
      date: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });

    this.firebaseService.getDataBaseRef('reviews').set(this.reviews);
    this.notifications.reviews += 1;
    this.firebaseService.getDataBaseRef('notifications').set(this.notifications);
  }

}
