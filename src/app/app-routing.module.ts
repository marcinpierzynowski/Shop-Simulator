import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {component: RegisterComponent, path: 'register'},
  {component: ProductsComponent, path: 'products'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
