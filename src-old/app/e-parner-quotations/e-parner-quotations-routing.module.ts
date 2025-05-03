import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EPartnerQuotationComponent } from './e-partner-quotation/e-partner-quotation.component';

const routes: Routes = [
  {
    path: 'e-partner/:id',component: EPartnerQuotationComponent,
    children: [
      { path: '', redirectTo: 'business', pathMatch: 'full' },
      { path: 'business', component: EPartnerQuotationComponent },
      { path: 'dsr', component: EPartnerQuotationComponent },
      { path: 'offline-quote', component: EPartnerQuotationComponent },
      { path: 'gems', component: EPartnerQuotationComponent },
      { path: 'renewal', component: EPartnerQuotationComponent },
      { path: 'claims', component: EPartnerQuotationComponent },
      { path: 'my_client', component: EPartnerQuotationComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EParnerQuotationsRoutingModule { }
