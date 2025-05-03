import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEndosmentComponent } from './create-endosment/create-endosment.component';
import { EndosmentFormComponent } from './endosment-form/endosment-form.component';
import { ViewEndosmentComponent } from './view-endosment/view-endosment.component';
import { ManageEndosmentComponent } from './manage-endosment/manage-endosment.component';
import { ViewDetailsComponent } from './view-details/view-details.component';

const routes: Routes = [
  { path: 'create-requests', component: CreateEndosmentComponent },
  { path: 'details-form/:srNo', component: EndosmentFormComponent },
  { path: 'view-requests', component: ViewEndosmentComponent },
  { path: 'endorsement', component: ViewEndosmentComponent },
  { path: 'endorsement-pan-india', component: ViewEndosmentComponent },
  { path: 'manage-requests', component: ManageEndosmentComponent },
  { path : 'view-details/:Id', component : ViewDetailsComponent },
  { path : 'view-details/:Id/:RightType', component : ViewDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EndosmentRoutingModule { }
