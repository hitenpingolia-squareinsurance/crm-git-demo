import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ShowLeadsComponent} from './show-leads/show-leads.component';

const routes: Routes = [

    { path: 'digital-motor/quotation', component: ShowLeadsComponent },

    { path: 'digital-motor/proposal', component: ShowLeadsComponent },

    { path: 'digital-motor/payment', component: ShowLeadsComponent },

    { path: 'digital-motor/proceeded', component: ShowLeadsComponent },

    { path: 'digital-motor/complete', component: ShowLeadsComponent },

    { path: 'digital-health/quotation', component: ShowLeadsComponent },

    { path: 'digital-health/proposal', component: ShowLeadsComponent },

    { path: 'digital-health/payment', component: ShowLeadsComponent },

    { path: 'digital-health/proceeded', component: ShowLeadsComponent },

    { path: 'digital-health/complete', component: ShowLeadsComponent },

    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigitalLeadsRoutingModule { }
