import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { InsurerEmpRoutingModule } from './insurer-emp-routing.module';
import { AddInsurerComponent } from './add-insurer/add-insurer.component';
import { UpdateInsurerComponent } from './update-insurer/update-insurer.component';
import { DetailInsurerComponent } from './detail-insurer/detail-insurer.component';


@NgModule({
  declarations: [AddInsurerComponent, UpdateInsurerComponent, DetailInsurerComponent],
  imports: [
    CommonModule,
    InsurerEmpRoutingModule,
    FormsModule, 
    ReactiveFormsModule, 
    DataTablesModule, 
    BsDatepickerModule, 
    MatDialogModule, 
    NgMultiSelectDropDownModule,
  ],

  entryComponents: [
    UpdateInsurerComponent,
    AddInsurerComponent
  ],
})
export class InsurerEmpModule { }
