import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { VahanRoutingModule } from './vahan-routing.module';
import { VahansComponent } from './vahans/vahans.component';
import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { MatDialogModule } from '@angular/material/dialog';
import { NewDateComponent } from './new-date/new-date.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UpdateDateComponent } from './update-date/update-date.component';

 

@NgModule({
  declarations: [VahansComponent,NewDateComponent, UpdateDateComponent],

  imports: [
    CommonModule,
    BsDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    VahanRoutingModule,
    DataTablesModule,
    MatDialogModule,
    NgMultiSelectDropDownModule
  ],

  entryComponents: [
    NewDateComponent,
    UpdateDateComponent
  ]
})
export class VahanModule { }
