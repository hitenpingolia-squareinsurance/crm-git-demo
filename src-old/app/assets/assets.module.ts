import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { SharedModule } from "../shared/shared.module";

import { AssetsRoutingModule } from "./assets-routing.module";
import { CreateAssestComponent } from "./create-assest/create-assest.component";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [CreateAssestComponent],

  imports: [
    CommonModule,
    AssetsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatDialogModule,NgMultiSelectDropDownModule
  ],
})
export class AssetsModule {}
