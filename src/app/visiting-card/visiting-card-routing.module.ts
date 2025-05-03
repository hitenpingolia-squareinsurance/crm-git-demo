import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ViewVisitingCardComponent } from "./view-visiting-card/view-visiting-card.component";

const routes: Routes = [
  { path: "view-visiting", component: ViewVisitingCardComponent },
  { path: "rm-view-visiting", component: ViewVisitingCardComponent },
  // { path: 'hod-view-visiting', component:  ViewVisitingCardComponent },
  { path: "manager-view-visiting", component: ViewVisitingCardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitingCardRoutingModule {}
