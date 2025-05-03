import { NgModule } from "@angular/core";
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
import { CustomReportRoutingModule } from "./custom-report-routing.module";
import { PosactivationreportComponent } from "./posactivationreport/posactivationreport.component";
import { SharedModule } from "../shared/shared.module";
import { BusinessreportComponent } from "./businessreport/businessreport.component";
import { ChartsModule, ThemeService } from "ng2-charts";
import { NgApexchartsModule } from "ng-apexcharts";
import { RenewalCustomReportComponent } from "./renewal-custom-report/renewal-custom-report.component";

// import { NgApexchartsModule } from "ng-apexcharts";
@NgModule({
  declarations: [
    PosactivationreportComponent,
    BusinessreportComponent,
    RenewalCustomReportComponent,
  ],

  imports: [
    CommonModule,
    CustomReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    DataTablesModule,
    BsDatepickerModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatCommonModule,
    MatButtonModule,
    SharedModule,
    ChartsModule,
    NgApexchartsModule,
  ],

  providers: [ThemeService],
})
export class CustomReportModule {}
