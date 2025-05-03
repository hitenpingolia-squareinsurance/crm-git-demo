import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewLeadsComponent } from './view-leads/view-leads.component';

const routes: Routes = [
  { path: 'leads', component: ViewLeadsComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LMSRoutingModule { }
