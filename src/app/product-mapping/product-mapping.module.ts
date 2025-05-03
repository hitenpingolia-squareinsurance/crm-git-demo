import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { SharedModule } from "../shared/shared.module";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ProductMappingRoutingModule } from './product-mapping-routing.module';
import { ProductMasterComponent } from './product-master/product-master.component';


@NgModule({
  declarations: [ProductMasterComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    ProductMappingRoutingModule,
  ]
})
export class ProductMappingModule { }
