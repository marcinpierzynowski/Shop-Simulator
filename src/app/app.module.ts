import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsComponent } from './products/products.component';
import { MessageComponent } from './message/message.component';
import { OrdersComponent } from './orders/orders.component';

@NgModule({
   declarations: [
      AppComponent,
      RegisterComponent,
      ProductsComponent,
      MessageComponent,
      OrdersComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule
   ],
   bootstrap: [
      AppComponent
   ],
   providers: [
      DatePipe,
      CommonModule
   ]
})
export class AppModule { }
