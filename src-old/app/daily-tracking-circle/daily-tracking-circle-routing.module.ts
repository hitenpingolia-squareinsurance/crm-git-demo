import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AllClubReportComponent } from './all-club-report/all-club-report.component';
import { CircleReportsComponent } from './circle-reports/circle-reports.component';

const routes: Routes = [
  // { path: 'all-club-report', component: AllClubReportComponent },
  { path: 'circle-health', component: CircleReportsComponent },
  { path: 'circle-motor', component: CircleReportsComponent },
  { path: 'circle-non-motor', component: CircleReportsComponent },
  { path: 'circle-life', component: CircleReportsComponent },
  { path: 'circle-finance', component: CircleReportsComponent },
  { path: 'circle-mutual-fund', component: CircleReportsComponent },
  { path: 'circle-real-estate', component: CircleReportsComponent },
  { path: 'circle-credit-card', component: CircleReportsComponent },
  { path: 'non-club', component: CircleReportsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyTrackingCircleRoutingModule { }
