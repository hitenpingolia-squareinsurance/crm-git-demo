import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FailedpaymenttracklogComponent } from "./failedpaymenttracklog/failedpaymenttracklog.component";
import { MappinglogComponent } from "./mappinglog/mappinglog.component";


const routes: Routes = [

  { path: 'FailedPaymentTracklog', component: FailedpaymenttracklogComponent },
  { path: 'Mapping-Log', component: MappinglogComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentTrackRoutingModule { }
