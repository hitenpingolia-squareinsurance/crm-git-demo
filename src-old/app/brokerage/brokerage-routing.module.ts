import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PoStatementComponent } from "./po-statement/po-statement.component";
import { AllPayoutRequestsComponent } from "./all-payout-requests/all-payout-requests.component";
import { AgentsTdsComponent } from "./agents-tds/agents-tds.component";
import { PoRequestsComponent } from "./po-requests/po-requests.component";
import { BrokerageReportComponent } from "./brokerage-report/brokerage-report.component";
import { AgentRmaComponent } from "./agent-rma/agent-rma.component";
import { FilesPayoutRequestsComponent } from "./files-payout-request/files-payout-request.component";
import { PayOutRequestComponent } from "./pay-out-request/pay-out-request.component";
import { BbrReportMailComponent } from "./bbr-report-mail/bbr-report-mail.component";
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
import { ExtraRewardFilesComponent } from './bulk-upload/extra-reward-files/extra-reward-files.component';
import { RecoveryFilesComponent } from './bulk-upload/recovery-files/recovery-files.component';
import { ExcelSrBulkUploadComponent } from './bulk-upload/excel-sr-bulk-upload/excel-sr-bulk-upload.component';
import { SrCustomUpdationReportComponent } from "./bulk-upload/sr-custom-updation-report/sr-custom-updation-report.component";
import {ViewInvoiceComponent} from './invoiceing/view-invoice/view-invoice.component';
import { InvoiceDiscriptionMasterComponent } from "./invoiceing/invoice-discription-master/invoice-discription-master.component";
import { GenerateInvoiceNewComponent } from "./invoiceing/generate-invoice-new/generate-invoice-new.component";
const routes: Routes = [
  { path: "checkgrid", component: CheckgridComponent },
  { path: "admin-business-report", component: AdminBusinessReportComponent },
  { path: "po-statement", component: PoStatementComponent },
  { path: "infra-tds", component: AgentsTdsComponent },
  { path: "po-requests", component: PoRequestsComponent },
  { path: "brokerage-report", component: BrokerageReportComponent },
  { path: "agent-rma", component: AgentRmaComponent },
  { path: "files-payout-request", component: FilesPayoutRequestsComponent },
  { path: "pay-out-request", component: PayOutRequestComponent },
  { path: "all-po-requests", component: AllPayoutRequestsComponent },
  { path: "bbr-report-mail", component: BbrReportMailComponent },
  { path: "invoice", component: InvoiceingComponent },
  { path: "generate-invoice", component: GenerateInvoiceNewComponent },

  
  { path: "view_invoice/user", component: ViewInvoiceComponent },
  { path: "view_invoice/manager", component: ViewInvoiceComponent },
  { path: "view_invoice/account", component: ViewInvoiceComponent },

  { path: "scheduler-report", component: SchedulerReportComponent },
  { path: "sr-recovery-report", component: SrRecoveryReportComponent },

  { path: "posting/advance", component: PayoutPostingComponent },
  { path: "posting/weekly", component: PayoutPostingComponent },
  { path: "posting/monthly", component: PayoutPostingComponent },

  { path: "request/fortnight", component: PayoutRequestComponent },
  { path: "request/early", component: PayoutRequestComponent },

  { path: "request/advance", component: PayoutRequestComponent },
  { path: "request/weekly", component: PayoutRequestComponent },
  { path: "request/monthly", component: PayoutRequestComponent },
  { path: "partner-earning", component: PartnerEarningComponent },
  
  { path: "posting/fortnight", component: PayoutPostingComponent },
  { path: "posting/early", component: PayoutPostingComponent },

  { path: "acb-report", component: AcbReportComponent },

  { path: "early-payout-request", component: EarlyPayoutRequestsComponent },
  { path: "early-payout-wallet", component: EarlyPayoutWalletComponent },
  { path: "partner-wise", component: PartnerWiseComponent },
  { path: "sr-wise", component: SrWiseComponent },
  {path:'bulk-upload/extra-reward-files',component:ExtraRewardFilesComponent},
  {path:'bulk-upload/recovery-files',component:RecoveryFilesComponent},
  {path:'bulk-upload/sr-uploading',component:ExcelSrBulkUploadComponent},
  { path: 'bulk-upload/sr-custom-updation-report', component: SrCustomUpdationReportComponent },
  { path: 'bulk-upload/sr-custom-updation-report-regulatory', component: SrCustomUpdationReportComponent },

  { path: "posting/fortnight", component: PayoutPostingComponent },
  { path: "request/fortnight", component: PayoutRequestComponent },
  { path: "discription_master", component: InvoiceDiscriptionMasterComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrokerageRoutingModule {}
