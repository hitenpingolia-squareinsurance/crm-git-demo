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
import { SharedModule } from "../shared/shared.module";
import { ChartsModule, ThemeService } from "ng2-charts";
import { NgApexchartsModule } from "ng-apexcharts";

import { ManagementReportsRoutingModule } from "./management-reports-routing.module";
import { LeadReportComponent } from "./lead-report/lead-report.component";
import { AgentRetentionComponent } from './agent-retention/agent-retention.component';
import { AgentConvertedComponent } from './agent-converted/agent-converted.component';
@NgModule({
  declarations: [LeadReportComponent, AgentRetentionComponent, AgentConvertedComponent],

  imports: [
    CommonModule,
    ManagementReportsRoutingModule,
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
export class ManagementReportsModule {}
