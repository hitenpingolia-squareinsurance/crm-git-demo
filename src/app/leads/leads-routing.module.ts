import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactUsQueryComponent } from './contact-us-query/contact-us-query.component';
import { ScheduleCallBackComponent } from './schedule-call-back/schedule-call-back.component';
import { CorporateInsuranceComponent } from './corporate-insurance/corporate-insurance.component';


const routes: Routes = [
  {path: 'Contact-Us', component: ContactUsQueryComponent},
  {path: 'Schedule-Callback', component: ScheduleCallBackComponent},
  {path: 'Corporate-Ins-Query', component: CorporateInsuranceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
