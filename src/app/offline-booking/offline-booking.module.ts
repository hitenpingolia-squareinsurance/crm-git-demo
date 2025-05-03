import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DataTablesModule } from "angular-datatables";
import {
  MatButtonModule,
  MatCommonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
} from "@angular/material";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";

import { OfflineBookingRoutingModule } from "./offline-booking-routing.module";
import { SrCreationComponent } from "./sr-creation/sr-creation.component";
import { SrCreationReportComponent } from "./sr-creation-report/sr-creation-report.component";
import { QcReportComponent } from './qc-report/qc-report.component';
import { ViewQcReportComponent } from './qc-report/view-qc-report/view-qc-report.component';
import { QcPdfReportComponent } from './qc-pdf-report/qc-pdf-report.component';
@NgModule({
  declarations: [SrCreationComponent, SrCreationReportComponent, QcReportComponent, ViewQcReportComponent, QcPdfReportComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    BsDatepickerModule,
    MatButtonModule,
    MatCommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatToolbarModule,
    OfflineBookingRoutingModule,
  ],
  entryComponents: [
    ViewQcReportComponent,
  ]
})
export class OfflineBookingModule {}
