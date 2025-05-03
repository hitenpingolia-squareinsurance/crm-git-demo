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


import { PartnerRoutingModule } from './partner-routing.module';
import { RmAgentCreationComponent } from './rm-agent-creation/rm-agent-creation.component';
import { OtpComponent } from './rm-agent-creation/otp/otp.component';
import { AgentReportComponent } from './agent-report/agent-report.component';
import { RmAgentEditComponent } from "./rm-agent-edit/rm-agent-edit.component";
import { FleetComponent } from './fleet/fleet.component';
import { FleetCreationComponent } from './fleet/fleet-creation/fleet-creation.component';
import { SpPosConversionComponent } from './sp-pos-conversion/sp-pos-conversion.component';
import { SpcQcReportComponent } from './spc-qc-report/spc-qc-report.component';



@NgModule({
  declarations: [
    RmAgentCreationComponent, 
    OtpComponent,
    AgentReportComponent,
    RmAgentEditComponent,
    FleetComponent,
    FleetCreationComponent,
    SpPosConversionComponent,
    SpcQcReportComponent
  ],

  imports: [
    CommonModule,
    PartnerRoutingModule,
    CommonModule,
    DataTablesModule,
    MatButtonModule,
    MatCommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    BsDatepickerModule,
    PartnerRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [OtpComponent],
})
export class PartnerModule { }
