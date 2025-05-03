import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ViewRequestComponent } from './view-request/view-request.component'
import {ClaimDetailsComponent} from './claim-details/claim-details.component'
// import{ClaimFormComponent} from './claim-form/claim-form.component'

const routes: Routes = [
  {path:'viewrequest', component: ViewRequestComponent},
  {path:'viewrequest/:Claim_Id', component: ClaimDetailsComponent},
  {path:'manage-requests', component: ViewRequestComponent},
  {path:'manage-requests/:Claim_Id', component: ClaimDetailsComponent},
  { path: "all-requests", component: ViewRequestComponent },
  // {path:'claim-form', component: ClaimFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimRoutingModule { }
