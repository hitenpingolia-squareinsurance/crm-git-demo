import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PospReportingRoutingModule } from "./posp-reporting-routing.module";
import { PospReportingViewComponent } from "./posp-reporting-view/posp-reporting-view.component";
import { SharedModule } from "../shared/shared.module";
import { MatDialogModule } from "@angular/material/dialog";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { TransferMultiplePospComponent } from "./transfer-multiple-posp/transfer-multiple-posp.component";

@NgModule({
  declarations: [
    PospReportingViewComponent,
    TransferMultiplePospComponent,
  ],
  imports: [
    CommonModule,
    PospReportingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    BsDatepickerModule,
    NgMultiSelectDropDownModule,
    MatDialogModule,
    SharedModule,
  ],
  entryComponents: [TransferMultiplePospComponent],
})
export class PospReportingModule {}
