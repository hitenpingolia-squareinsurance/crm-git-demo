import { MastertableComponent } from './mastertable/mastertable.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MotorQuoteDetailsComponent } from './motor-quote-details/motor-quote-details.component';
import { MotorReportsComponent } from './motor-reports/motor-reports.component';
import { MasterdataComponent } from './masterdata/masterdata.component';

const routes: Routes = [

  {path: 'Motor-reports', component: MotorReportsComponent},
  {path: 'Motor-reports/:Quote_Id', component: MotorQuoteDetailsComponent},
  {path: 'Mastertable', component: MastertableComponent},
  {path: 'Masterdata', component: MasterdataComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpdeskRoutingModule { }
