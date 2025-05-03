import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayInReportComponent } from './pay-in-report/pay-in-report.component';
import { AgentRmaListComponent } from './agent-rma-list/agent-rma-list.component';
import { AddAgentRmaComponent } from './add-agent-rma/add-agent-rma.component';
import { V2PayinSalesListComponent } from './v2-payin-sales-list/v2-payin-sales-list.component';
import { V2PayInRequestListComponent } from './v2-pay-in-request-list/v2-pay-in-request-list.component';


const routes: Routes = [
  {path:'pay-in-report',component:PayInReportComponent},
  {path:'agent-rma',component:AgentRmaListComponent},
  {path:'add-agent-rma',component:AddAgentRmaComponent},

  {path:'v2/payout/RM-Authority',component:V2PayinSalesListComponent},
  {path:'v2/payout/Request',component:V2PayInRequestListComponent},
  {path:'v2/payout/Team-Payout-Request',component:V2PayInRequestListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayInRoutingModule { }
