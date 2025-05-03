import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TargetMultiMonthReportComponent } from './target-multi-month-report/target-multi-month-report.component';
import { PmsTargetsReportComponent } from './pms-targets-report/pms-targets-report.component';
import { SalaryReportComponent } from './salary-report/salary-report.component';
import { IncentiveReportComponent } from './incentive-report/incentive-report.component';
import { PmsOtpGuard } from 'src/app/guards/pmsotp.guard';
// const routes: Routes = [
//   { path: 'reports', component: TargetMultiMonthReportComponent },
//   { path: 'target-reports', component: PmsTargetsReportComponent },
//   { path: 'salary-report', component: SalaryReportComponent },
//   { path: 'incentive-report', component: IncentiveReportComponent }
// ];



const routes: Routes = [
  { 
    path: 'reports', 
    component: TargetMultiMonthReportComponent,
    canActivate: [PmsOtpGuard]
  },
  { 
    path: 'target-reports', 
    component: PmsTargetsReportComponent,
    canActivate: [PmsOtpGuard] 
  },
  { 
    path: 'salary-report', 
    component: SalaryReportComponent,
    canActivate: [PmsOtpGuard]
  },
  { path: 'incentive-report', component: IncentiveReportComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PmsSectionRoutingModule { }
