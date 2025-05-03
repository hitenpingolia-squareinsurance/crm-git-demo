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

import { BrokerageRoutingModule } from "./brokerage-routing.module";
import { PoStatementComponent } from "./po-statement/po-statement.component";

import { PoRequestsComponent } from "./po-requests/po-requests.component";
import { AllPayoutRequestsComponent } from "./all-payout-requests/all-payout-requests.component";
import { BrokerageReportComponent } from "./brokerage-report/brokerage-report.component";
import { AgentRmaComponent } from "./agent-rma/agent-rma.component";
import { AgentsTdsComponent } from "./agents-tds/agents-tds.component";
import { PayOutRequestComponent } from "./pay-out-request/pay-out-request.component";
import { BbrReportMailComponent } from "./bbr-report-mail/bbr-report-mail.component";
import { FilesPayoutRequestsComponent } from "./files-payout-request/files-payout-request.component";
import { InvoiceingComponent } from "./invoiceing/invoiceing.component";
import { AdminBusinessReportComponent } from "./admin-business-report/admin-business-report.component";

import { PayoutPostingComponent } from "./payout-posting/payout-posting.component";
import { PayoutRequestComponent } from "./payout-request/payout-request.component";
import { SchedulerReportComponent } from "./scheduler-report/scheduler-report.component";
import { SrRecoveryReportComponent } from "./sr-recovery-report/sr-recovery-report.component";
import { CheckgridComponent } from "./checkgrid/checkgrid.component";
import { PartnerEarningComponent } from "./partner-earning/partner-earning.component";
import { AcbReportComponent } from "./acb-report/acb-report.component";
import { EarlyPayoutRequestsComponent } from './early-payout-requests/early-payout-requests.component';
import { EarlyPayoutWalletComponent } from './early-payout-wallet/early-payout-wallet.component';
import {PartnerWiseComponent} from './hold po report/partner-wise/partner-wise.component';
import {SrWiseComponent} from './hold po report/sr-wise/sr-wise.component';
import {HoldPoReportComponent} from './hold-po-report/hold-po-report.component';

import { ExtraRewardFilesComponent } from './bulk-upload/extra-reward-files/extra-reward-files.component';
import { RecoveryFilesComponent } from './bulk-upload/recovery-files/recovery-files.component';
import { ExcelSrBulkUploadComponent } from './bulk-upload/excel-sr-bulk-upload/excel-sr-bulk-upload.component';
import { SrCustomUpdationReportComponent } from './bulk-upload/sr-custom-updation-report/sr-custom-updation-report.component';
import {EarlyPayoutFilesComponent} from './brokerage-report/early-payout-files/early-payout-files.component';
import {ViewInvoiceComponent} from './invoiceing/view-invoice/view-invoice.component';
import { InvoiceDiscriptionMasterComponent } from "./invoiceing/invoice-discription-master/invoice-discription-master.component";
import { GenerateInvoiceNewComponent } from './invoiceing/generate-invoice-new/generate-invoice-new.component';


@NgModule({
  declarations: [
    PoStatementComponent,
    AcbReportComponent,
    CheckgridComponent,
    AgentsTdsComponent,
    PoRequestsComponent,
    BrokerageReportComponent,
    AgentRmaComponent,
    FilesPayoutRequestsComponent,
    AgentsTdsComponent,
    PayOutRequestComponent,
    BbrReportMailComponent,
    AllPayoutRequestsComponent,
    InvoiceingComponent,
    AdminBusinessReportComponent,
    PayoutPostingComponent,
    PayoutRequestComponent,
    SchedulerReportComponent,
    PartnerEarningComponent,
    SrRecoveryReportComponent,
    EarlyPayoutRequestsComponent,
    EarlyPayoutWalletComponent,
    PartnerWiseComponent,
    SrWiseComponent,
    HoldPoReportComponent,ExtraRewardFilesComponent,RecoveryFilesComponent,ExcelSrBulkUploadComponent,
    SrCustomUpdationReportComponent,EarlyPayoutFilesComponent,ViewInvoiceComponent,InvoiceDiscriptionMasterComponent, GenerateInvoiceNewComponent
  ],
  
  imports: [
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
    BrokerageRoutingModule,
  ],
  entryComponents: [HoldPoReportComponent,EarlyPayoutFilesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BrokerageModule {}
