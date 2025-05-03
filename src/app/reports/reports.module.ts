import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";

import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";

import { NgxSpinnerModule } from "ngx-spinner";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatDividerModule } from "@angular/material/divider";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TimepickerModule } from "ngx-bootstrap/timepicker";

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ReportsRoutingModule } from "./reports-routing.module";
import { PospReportsComponent } from "./posp-reports/posp-reports.component";
import { SharedModule } from "../shared/shared.module";
import { FilterModuleModule } from "../filter-module/filter-module.module";

import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { BusinessReportsComponent } from "./business-reports/business-reports.component";
import { ActivationReportComponent } from "./activation-report/activation-report.component";
import { SlabReportsComponent } from "./slab-reports/slab-reports.component";
import { NewActivationReportComponent } from './new-activation-report/new-activation-report.component';
import {QcTransferReportComponent} from './qc-transfer-report/qc-transfer-report.component';
import { BusinessStuckCasesComponent } from "./business-stuck-cases/business-stuck-cases.component";
@NgModule({
  declarations: [
    PospReportsComponent,
    BusinessReportsComponent,
    ActivationReportComponent,
    SlabReportsComponent,
    NewActivationReportComponent,
    QcTransferReportComponent,BusinessStuckCasesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule,
    ReportsRoutingModule,
    BsDatepickerModule,
    SharedModule,
    FilterModuleModule,
    MatDialogModule,
    MatTabsModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
    ScrollingModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ],
  // entryComponents: [],
})
export class ReportsModule {}
