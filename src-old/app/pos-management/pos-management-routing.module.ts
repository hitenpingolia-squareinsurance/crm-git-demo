import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ViewPospComponent } from "./view-posp/view-posp.component";
import { ViewUsersComponent } from "./view-users/view-users.component";
import { ViewPanInfoComponent } from "./view-pan-info/view-pan-info.component";
import { EPartnerComponent } from "./e-partner/e-partner.component";
import { InvoiceComponent } from "./invoice/invoice.component";
import { OccupationComponent } from "./masters/occupation/occupation.component";
import { PospBulkMappingChangeComponent } from "./posp-bulk-mapping-change/posp-bulk-mapping-change.component";

const routes: Routes = [
  { path: "Users", component: ViewUsersComponent },
  { path: "Posp/Posp-leads", component: ViewPospComponent },
  { path: "Posp/New-Posp", component: ViewPospComponent },
  { path: "Posp/Verified-Docs", component: ViewPospComponent },
  { path: "Posp/Under-Training-Posp", component: ViewPospComponent },
  { path: "Posp/life-Training-Posp", component: ViewPospComponent },
  { path: "Posp/Verified-Posp", component: ViewPospComponent },
  { path: "Posp/Incomplete-Posp", component: ViewPospComponent },
  { path: "Posp/Rejected-Posp", component: ViewPospComponent },
  { path: "Posp/Noc-Released", component: ViewPospComponent },
  { path: "Posp/invalid-pan", component: ViewPanInfoComponent },
  { path: "Posp/invoices/:Id", component: InvoiceComponent },
  // { path: "Posp/Verified-Posp", component: ViewPospComponent },
  { path: "Posp/ePartner", component: EPartnerComponent },
  { path: "masters/occupation", component: OccupationComponent },
  { path: "Posp-bulk-mapping", component: PospBulkMappingChangeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosManagementRoutingModule {}
