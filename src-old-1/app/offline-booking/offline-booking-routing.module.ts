import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SrCreationComponent } from './sr-creation/sr-creation.component';
import { SrCreationReportComponent } from './sr-creation-report/sr-creation-report.component';
import { QcReportComponent } from './qc-report/qc-report.component';
import { QcPdfReportComponent } from './qc-pdf-report/qc-pdf-report.component';

const routes: Routes = [
  {path:'report',component:SrCreationReportComponent},
  {path:'sr-login',component:SrCreationComponent},
  {path:'qc-report',component:QcReportComponent},
  {path:'qc-pdf-report',component:QcPdfReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfflineBookingRoutingModule { }
