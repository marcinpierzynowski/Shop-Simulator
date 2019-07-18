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
  loginAccountForm: FormGroup;
  customers: Array<Customer>;

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
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/shop-stoma.appspot.com/o/customer-ala%40wp.pl.jpg?alt=media&token=3a2288ae-9843-4477-bf91-2e3310f5b683',
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

}
