import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { FirebaseService } from '../firebase.service';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public loginAccountForm: FormGroup;
  public customers: Array<Customer>;
  public urls = [
    // tslint:disable-next-line:max-line-length
    'https://firebasestorage.googleapis.com/v0/b/shop-stoma.appspot.com/o/CUSTOMERS%2F1-customer.jpg?alt=media&token=2ed248c3-ad70-438f-b845-c73adcd0d7b9',
    // tslint:disable-next-line:max-line-length
    'https://firebasestorage.googleapis.com/v0/b/shop-stoma.appspot.com/o/CUSTOMERS%2F10-customer.jpg?alt=media&token=34b6bb98-8f82-42f9-ae50-4b16b4280ce3',
    // tslint:disable-next-line:max-line-length
    'https://firebasestorage.googleapis.com/v0/b/shop-stoma.appspot.com/o/CUSTOMERS%2F2-customer.jpg?alt=media&token=065d77e6-12f9-4e09-a34d-0873708de59e',
    // tslint:disable-next-line:max-line-length
    'https://firebasestorage.googleapis.com/v0/b/shop-stoma.appspot.com/o/CUSTOMERS%2F3-customer.jpg?alt=media&token=e88a5395-81bc-482f-94a9-68980fa5e578',
    // tslint:disable-next-line:max-line-length
    'https://firebasestorage.googleapis.com/v0/b/shop-stoma.appspot.com/o/CUSTOMERS%2F4-customer.jpeg?alt=media&token=484e2470-27f7-466b-8eb1-97ada63b4b1c',
    // tslint:disable-next-line:max-line-length
    'https://firebasestorage.googleapis.com/v0/b/shop-stoma.appspot.com/o/CUSTOMERS%2F5-customer.jpg?alt=media&token=629e9868-bc49-42b0-9542-7c4b5d3a41c0',
    // tslint:disable-next-line:max-line-length
    'https://firebasestorage.googleapis.com/v0/b/shop-stoma.appspot.com/o/CUSTOMERS%2F6-customer.jpg?alt=media&token=e4930ed6-ed8c-4c7b-9207-655d4ebc486d',
    // tslint:disable-next-line:max-line-length
    'https://firebasestorage.googleapis.com/v0/b/shop-stoma.appspot.com/o/CUSTOMERS%2F7-customer.jpg?alt=media&token=be0a36df-185f-4598-a1cf-c905e92e74f0',
    // tslint:disable-next-line:max-line-length
    'https://firebasestorage.googleapis.com/v0/b/shop-stoma.appspot.com/o/CUSTOMERS%2F8-customer.jpg?alt=media&token=b66d14fa-9d61-4f77-a768-1fcb6216fdd2',
    // tslint:disable-next-line:max-line-length
    'https://firebasestorage.googleapis.com/v0/b/shop-stoma.appspot.com/o/CUSTOMERS%2F9-customer.jpg?alt=media&token=725f40fb-adca-40b5-882f-0524ead192c5'
  ];
  public url = this.urls[0];

  constructor(
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.initForms();
    this.firebaseService.customersData.subscribe((c) => {
      this.customers = c;
    });
  }

  public initForms(): void {
    this.loginAccountForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      contact: new FormControl('', Validators.required)
    });
  }

  public submit(): void {
    if (this.loginAccountForm.valid) {
      const customer: Customer = {
        ...this.loginAccountForm.value,
        // tslint:disable-next-line:max-line-length
        imageUrl: this.url,
        imageName: this.loginAccountForm.value.email
      };
      this.customers.push(customer);
      this.firebaseService.getDataBaseRef('customers').set(this.customers)
        .then(() => {
          swal.fire('Rejestracja', 'Klient został dodany', 'success');
        });
    } else {
      swal.fire('Rejestracja', 'Wypełnij Wszystkie Pola', 'error');
    }
  }

  public setPicture(e): void {
    this.url = e.target.value;
  }

}
