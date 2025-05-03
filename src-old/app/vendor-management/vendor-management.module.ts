import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from "angular-datatables";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { VendorManagementRoutingModule } from './vendor-management-routing.module';
import { VendorRequestComponent } from './vendor-request/vendor-request.component';


@NgModule({
  declarations: [VendorRequestComponent],
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule,
    VendorManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
  ]
})
export class VendorManagementModule { }
