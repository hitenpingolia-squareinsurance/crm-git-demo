import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CashlessgarageComponent } from "./cashlessgarage/cashlessgarage.component";

// const routes: Routes = [];
const routes: Routes = [
  { path: "master", component: CashlessgarageComponent },
  { path: "request", component: CashlessgarageComponent },
  { path: "manager", component: CashlessgarageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashlessgarageRoutingModule {}
