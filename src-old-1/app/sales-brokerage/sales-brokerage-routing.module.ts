import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { V2PayinSalesListComponent } from './v2-payin-sales-list/v2-payin-sales-list.component';
import { V2PayInRequestListComponent } from './v2-pay-in-request-list/v2-pay-in-request-list.component';
import { PartnerEarningComponent } from './partner-earning/partner-earning.component';
import { FilesPayoutRequestsComponent } from './files-payout-request/files-payout-request.component';
import { SalesBusinessReportComponent } from './sales-business-report/sales-business-report.component';
import { HodRenewalCasesComponent } from './hod-renewal-cases/hod-renewal-cases.component';
import { BrokerageReportComponent } from './brokerage-report/brokerage-report.component'; 

const routes: Routes = [
  {path:'update-payout',component:V2PayinSalesListComponent},
  {path:'my-po-request',component:V2PayInRequestListComponent},
  {path:'team-po-request',component:V2PayInRequestListComponent},
  {path:'partner-earning',component:PartnerEarningComponent},
  {path:'files-payout-request/daily',component:FilesPayoutRequestsComponent},
  {path:'files-payout-request/weekly',component:FilesPayoutRequestsComponent},
  {path:'files-payout-request/monthly',component:FilesPayoutRequestsComponent},
  {path:'files-payout-request/fortnight',component:FilesPayoutRequestsComponent},
  {path:'blocked-cases',component:SalesBusinessReportComponent},
  {path: 'other-code-renewal-cases', component: HodRenewalCasesComponent }, 
  {path: 'brokerage-report', component: BrokerageReportComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesBrokerageRoutingModule { }
