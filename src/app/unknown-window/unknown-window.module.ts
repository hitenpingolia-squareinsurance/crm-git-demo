
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { UnknownWindowRoutingModule } from './unknown-window-routing.module';
import { FetchUnknownFilesComponent } from './fetch-unknown-files/fetch-unknown-files.component';
import { SharedModule } from "../shared/shared.module";
 

@NgModule({
  declarations: [FetchUnknownFilesComponent],


  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    DataTablesModule,
    UnknownWindowRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,SharedModule

  ],
 
})
export class UnknownWindowModule { }
