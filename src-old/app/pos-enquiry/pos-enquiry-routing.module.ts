import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PosDetailsComponent } from './pos-details/pos-details.component';


const routes: Routes = [
  { path: 'pos-enquiry', component: PosDetailsComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosEnquiryRoutingModule { }
