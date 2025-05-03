import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SquaremasterComponent } from "./squaremaster/squaremaster.component";
import { SrPolicyReportsComponent } from "./sr-policy-reports/sr-policy-reports.component";
import { SrHierarchyComponent } from "./sr-hierarchy/sr-hierarchy.component";

const routes: Routes = [
  { path: "squaremaster/:id", component: SquaremasterComponent },
  { path: "breakSr", component: SrHierarchyComponent },
  { path: "SrPolicyReportsComponent", component: SrPolicyReportsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MappingRoutingModule {}
