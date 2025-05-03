import { Component, NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ViewManagerLeadsComponent } from "./view-manager-leads/view-manager-leads.component";
import { ViewRmLeadsComponent } from "./view-rm-leads/view-rm-leads.component";
import { LmsReportComponent } from "./lms-report/lms-report.component";
import { LmsDashboardComponent } from "./lms-dashboard/lms-dashboard.component";
import { ExtraLeadsComponent } from "./extra-leads/extra-leads.component";
import { CampaignViewComponent } from "./campaign-view/campaign-view.component";

const routes: Routes = [
  { path: "view-requests", component: ViewRmLeadsComponent },
  { path: "manage-requests", component: ViewManagerLeadsComponent },
  { path: "report", component: LmsReportComponent },
  { path: "dashboard", component: LmsDashboardComponent },
  { path: "social_leads/:any", component: ExtraLeadsComponent },
  { path: "social_leads", component: ExtraLeadsComponent },
  { path: "campaign", component: CampaignViewComponent },
  { path: "campaign-manager", component: CampaignViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadManagementRoutingModule {}
