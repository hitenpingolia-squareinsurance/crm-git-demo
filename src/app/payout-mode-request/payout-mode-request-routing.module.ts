import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayoutReportComponent } from './payout-report/payout-report.component';


const routes: Routes = [
  {path: 'payout-report', component: PayoutReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayoutModeRequestRoutingModule { }
