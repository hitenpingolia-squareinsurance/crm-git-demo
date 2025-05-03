import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { BusinessCommitRoutingModule } from './business-commit-routing.module';
import { BusinessReportComponent } from './business-report/business-report.component';


@NgModule({
  declarations: [BusinessReportComponent],
  imports: [
    CommonModule,
    BsDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatDialogModule,
    NgMultiSelectDropDownModule,
    BusinessCommitRoutingModule
  ]
})
export class BusinessCommitModule { }
