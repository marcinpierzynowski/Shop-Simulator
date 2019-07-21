import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ProductsComponent } from './products/products.component';
import { MessageComponent } from './message/message.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  { component: RegisterComponent, path: 'register' },
  { component: ProductsComponent, path: 'products' },
  { component: OrdersComponent, path: 'orders' },
  { component: MessageComponent, path: 'message' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
