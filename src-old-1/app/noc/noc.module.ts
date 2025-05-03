import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from "../shared/shared.module";


import { NOCRoutingModule } from './noc-routing.module';
import { ViewNocComponent } from './view-noc/view-noc.component';


@NgModule({
  declarations: [ViewNocComponent],
  imports: [
    CommonModule,SharedModule,
    NOCRoutingModule,
    FormsModule,ReactiveFormsModule,DataTablesModule,MatDialogModule,NgMultiSelectDropDownModule,

  ],



})
export class NOCModule { }
