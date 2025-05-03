import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AssetsManagementComponent } from "./assets-management/assets-management.component";
// import { RequestComponent } from "./request/request.component";
import { InventoryComponent } from "./inventory/inventory.component";
import { ItemsrnoComponent } from "./itemsrno/itemsrno.component";
import { AssestActionStatusViewComponent } from "./assest-action-status-view/assest-action-status-view.component";
import { AssestViewComponent } from "./assest-view/assest-view.component";


const routes: Routes = [
  { path: "create-assest-manegment", component: AssetsManagementComponent },

  { path: "view-assest-manegment", component: AssestViewComponent },
  { path: "action-assest-manegment", component: AssestViewComponent },
  { path: "assest-hod", component: AssestViewComponent },
  { path: "assest-distributor", component: AssestViewComponent },
  { path: "assest-maneger", component: AssestViewComponent },
  { path: "inventory-maneger", component: InventoryComponent },
  { path: "inventory-account", component: InventoryComponent },
  { path: "inventory-distributor", component: InventoryComponent },
  // {path: 'uploaditem', component: ItemsrnoComponent},
  {
    path: "assest-action-distributor",
    component: AssestActionStatusViewComponent,
  },
  {
    path: "assest-action-manager",
    component: AssestActionStatusViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsmanagementRoutingModule {}