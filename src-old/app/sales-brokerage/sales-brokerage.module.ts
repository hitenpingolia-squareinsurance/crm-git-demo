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
import { SharedModule } from "../shared/shared.module";

import { SalesBrokerageRoutingModule } from "./sales-brokerage-routing.module";
import { V2PayinSalesListComponent } from "./v2-payin-sales-list/v2-payin-sales-list.component";
import { V2PayInRequestListComponent } from "./v2-pay-in-request-list/v2-pay-in-request-list.component";
import { PartnerEarningComponent } from "./partner-earning/partner-earning.component";
import { FilesPayoutRequestsComponent } from "./files-payout-request/files-payout-request.component";
import { SalesBusinessReportComponent } from "./sales-business-report/sales-business-report.component";
import { HodRenewalCasesComponent } from "./hod-renewal-cases/hod-renewal-cases.component";
import { BrokerageReportComponent } from "./brokerage-report/brokerage-report.component";

//modals
import { V2PayInRequestUpdateComponent } from "./v2-pay-in-request-update/v2-pay-in-request-update.component";
import { V2PayInDataviewComponent } from "./v2-pay-in-dataview/v2-pay-in-dataview.component";
//modals

@NgModule({
  declarations: [
    V2PayinSalesListComponent,
    V2PayInRequestListComponent,
    V2PayInRequestUpdateComponent,
    V2PayInDataviewComponent,
    PartnerEarningComponent,
    FilesPayoutRequestsComponent,
    SalesBusinessReportComponent,
    HodRenewalCasesComponent,
    BrokerageReportComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
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
    SalesBrokerageRoutingModule,
  ],
  entryComponents: [V2PayInRequestUpdateComponent, V2PayInDataviewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SalesBrokerageModule {}
