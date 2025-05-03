import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RegulatoryReportsComponent } from "./regulatory-reports/regulatory-reports.component";
import { AdminReportComponent } from "./admin-report/admin-report.component";

const routes: Routes = [
  {
    path: "insurer-wise",
    component: RegulatoryReportsComponent,
  },
  {
    path: "top-customers",
    component: RegulatoryReportsComponent,
  },
  {
    path: "top-insurer",
    component: RegulatoryReportsComponent,
  },
  {
    path: "department-business",
    component: RegulatoryReportsComponent,
  },
  {
    path: "business-report",
    component: RegulatoryReportsComponent,
  },
  {
    path: "posp-wise",
    component: RegulatoryReportsComponent,
  },
  {
    path: "admin-report",
    component: AdminReportComponent,
  },
  {
    path: "admin-business-report",
    component: AdminReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaibaRoutingModule {}
