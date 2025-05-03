import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { MappingRoutingModule } from "./mapping-routing.module";
import { SquaremasterComponent } from "./squaremaster/squaremaster.component";
import { SrPolicyReportsComponent } from "./sr-policy-reports/sr-policy-reports.component";
import { SrHierarchyComponent } from "./sr-hierarchy/sr-hierarchy.component";

@NgModule({
  declarations: [
    SquaremasterComponent,
    SrHierarchyComponent,
    SrPolicyReportsComponent,
  ],
  imports: [
    CommonModule,
    MappingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule,
  ],
})
export class MappingModule {}
