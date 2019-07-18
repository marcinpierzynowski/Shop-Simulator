import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Product, Reviews } from '../models/product.model';
import swal from 'sweetalert2';
import { Customer } from '../models/customer.model';
import { DatePipe } from '@angular/common';

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
  }

  public addOpinion( ref: string): void {
    const cust = this.customers.find(c => c.email === this.customer);
    const data: Reviews = {
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
  }

}
