import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PospReportingViewComponent } from "./posp-reporting-view/posp-reporting-view.component";

const routes: Routes = [
  { path: "view-pos-lob-requests", component: PospReportingViewComponent },
  { path: "view-transfer-lob-request", component: PospReportingViewComponent },
  { path: "withdraw-request", component: PospReportingViewComponent },

  { path: "posp-lob-request", component: PospReportingViewComponent },
  { path: "posp-lob-request-admin", component: PospReportingViewComponent },
  { path: "posp-lob-request-user", component: PospReportingViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PospReportingRoutingModule {}
