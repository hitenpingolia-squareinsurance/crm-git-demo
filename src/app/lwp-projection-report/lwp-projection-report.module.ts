import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";
import { MatDialogModule } from '@angular/material/dialog';

import { LwpProjectionReportRoutingModule } from './lwp-projection-report-routing.module';
import { LwpProjectionReportComponent } from './lwp-projection-report/lwp-projection-report.component';
import { LwpRecordsComponent } from './lwp-records/lwp-records.component';


@NgModule({
  declarations: [LwpProjectionReportComponent, LwpRecordsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    SharedModule,
    MatDialogModule,
    LwpProjectionReportRoutingModule
  ],
  entryComponents: [LwpRecordsComponent]
})
export class LwpProjectionReportModule { }
