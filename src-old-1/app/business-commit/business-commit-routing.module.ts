import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessReportComponent } from './business-report/business-report.component';

const routes: Routes = [
  {path: 'business-report', component: BusinessReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessCommitRoutingModule { }
