import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductReportComponent } from './product-report/product-report.component';


const routes: Routes = [
  { path: 'product-report', component: ProductReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductMasterRoutingModule { }
