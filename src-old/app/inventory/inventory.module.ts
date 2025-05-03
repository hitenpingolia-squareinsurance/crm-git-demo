import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { SharedModule } from "../shared/shared.module";

import { InventoryRoutingModule } from "./inventory-routing.module";
import { CreateItemComponent } from "./create-item/create-item.component";

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { AddCategoryComponent } from "./add-category/add-category.component";
import { ViewCateComponent } from "./view-cate/view-cate.component";
import { ViewItemComponent } from './view-item/view-item.component';
import { EditQuantityComponent } from "../AssetsManagement/edit-quantity/edit-quantity.component";
 


@NgModule({
  declarations: [ CreateItemComponent,AddCategoryComponent,ViewCateComponent, ViewItemComponent ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatDialogModule,
    NgMultiSelectDropDownModule,
  ],
  entryComponents: [
    AddCategoryComponent
  ]

})
export class InventoryModule {}
