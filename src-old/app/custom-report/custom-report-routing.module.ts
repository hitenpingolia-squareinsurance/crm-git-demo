import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BusinessreportComponent } from "./businessreport/businessreport.component";
import { PosactivationreportComponent } from "./posactivationreport/posactivationreport.component";
import { RenewalCustomReportComponent } from "./renewal-custom-report/renewal-custom-report.component";

const routes: Routes = [
  {
    path: "custom-active-inactive-pos",
    component: PosactivationreportComponent,
  },
  { path: "busniess-custom-report", component: BusinessreportComponent },
  { path: "renewal-custom-report", component: RenewalCustomReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomReportRoutingModule { }
