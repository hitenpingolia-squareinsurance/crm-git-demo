import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DsrRmReportsComponent } from "./dsr-rm-reports/dsr-rm-reports.component";
import { ClubManagerWindowComponent } from "./club-manager-window/club-manager-window.component";
import { ClubManagerReportsComponent } from "./club-manager-reports/club-manager-reports.component";

const routes: Routes = [
  { path: "rm-reports", component: DsrRmReportsComponent },
  { path: "manager-reports", component: ClubManagerReportsComponent },
  { path: "club-manager", component: ClubManagerWindowComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsrModuleRoutingModule {}
