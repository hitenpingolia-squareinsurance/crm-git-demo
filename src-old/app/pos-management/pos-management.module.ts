import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PosManagementRoutingModule } from "./pos-management-routing.module";
import { ViewPospComponent } from "./view-posp/view-posp.component";
import { ViewUsersComponent } from "./view-users/view-users.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { DataTablesModule } from "angular-datatables";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ChartsModule } from "ng2-charts";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { SharedModule } from "../shared/shared.module";
import { ViewPanInfoComponent } from "./view-pan-info/view-pan-info.component";
import { UrlRedirectionComponent } from "./url-redirection/url-redirection.component";
import { MailLogsComponent } from "./mail-logs/mail-logs.component";
import { PospRightsComponent } from "./posp-rights/posp-rights.component";

import { EPartnerComponent } from "./e-partner/e-partner.component";
import { InvoiceComponent } from "./invoice/invoice.component";
import { GenerateInvoiceComponent } from "./generate-invoice/generate-invoice.component";
import { OccupationComponent } from "./masters/occupation/occupation.component";
import { PospBulkMappingChangeComponent } from "./posp-bulk-mapping-change/posp-bulk-mapping-change.component";

@NgModule({
  // declarations: [ViewPospComponent, ViewUsersComponent,ViewPanInfoComponent],
  declarations: [
    ViewPospComponent,
    ViewUsersComponent,
    ViewPanInfoComponent,
    UrlRedirectionComponent,
    MailLogsComponent,
    PospRightsComponent,
    InvoiceComponent,
    EPartnerComponent,
    GenerateInvoiceComponent,
    OccupationComponent,
    PospBulkMappingChangeComponent,
  ],
  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    DataTablesModule,
    PosManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDialogModule,
    ChartsModule,
  ],
  entryComponents: [
    UrlRedirectionComponent,
    MailLogsComponent,
    PospRightsComponent,
    GenerateInvoiceComponent,
  ],
})
export class PosManagementModule {}
