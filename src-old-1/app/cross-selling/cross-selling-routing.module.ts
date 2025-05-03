import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyTrackerComponent } from './daily-tracker/daily-tracker.component';
import { ManagerReportComponent } from './manager-report/manager-report.component';
import { RmReportComponent } from './rm-report/rm-report.component';

const routes: Routes = [
  { path: 'daily-tracker', component: DailyTrackerComponent },
  { path: 'rm_tracking_report', component: RmReportComponent },
  { path: 'manager_tracking_report', component: ManagerReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CrossSellingRoutingModule { }
