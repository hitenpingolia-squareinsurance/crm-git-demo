import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateItemComponent } from "./create-item/create-item.component";
import { ViewCateComponent } from "./view-cate/view-cate.component";
import { ViewItemComponent } from "./view-item/view-item.component";

const routes: Routes = [
  { path: "Create-Item/:category", component: CreateItemComponent },
  { path: "Edit-Item/:category/:item", component: CreateItemComponent },
  { path: "View-category", component: ViewCateComponent },
  { path: "View-item", component: ViewItemComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
