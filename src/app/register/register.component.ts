import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loginAccountForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.initForms();
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
      
    } else {
      swal.fire('Rejestracja', 'Wypełnij Wszystkie Pola', 'error');
    }
  }

}
