import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { ClaimAssistanceComponent } from "./claim-assistance/claim-assistance.component";
import { OfflineQuoteComponent } from "./offline-quote/offline-quote.component";
import { EndorsementRequestComponent } from "./endorsement-request/endorsement-request.component";
import { SurveyRequestComponent } from "./survey-request/survey-request.component";
import { CancellationComponent } from "./cancellation/cancellation.component";
import { AssetsManagementComponent } from "./assets-management/assets-management.component";

import { AdminManagementComponent } from "./admin-management/admin-management.component";
import { BussinessReportComponent } from "./admin-management/bussiness-report/bussiness-report.component";
import { PospReportComponent } from "./admin-management/posp-report/posp-report.component";

import { EmployeeRightsComponent } from "./admin-management/employee-rights/employee-rights.component";
import { CreateClaimRequestComponent } from "./claim-assistance/create-claim-request/create-claim-request.component";
import { ClaimRequestsComponent } from "./claim-assistance/claim-requests/claim-requests.component";
import { ViewClaimComponent } from "./claim-assistance/view-claim/view-claim.component";
import { RenewalComponent } from "./renewal/renewal.component";

import { PayinPayoutComponent } from "./payin-payout/payin-payout.component";
import { AddPayinAgentWiseComponent } from "./payin-payout/add-payin-agent-wise/add-payin-agent-wise.component";
import { AddPayinComponent } from "./payin-payout/add-payin/add-payin.component";
import { PayoutPostingComponent } from "./payin-payout/payout-posting/payout-posting.component";
import { PayoutRequestComponent } from "./payin-payout/payout-request/payout-request.component";
import { TdsComponent } from "./payin-payout/tds/tds.component";
import { StatementComponent } from "./payin-payout/statement/statement.component";

import { RecoveryComponent } from "./recovery/recovery.component";
import { CashReportComponent } from "./cash-report/cash-report.component";
import { BulkMappingComponent } from "./bulk-mapping/bulk-mapping.component";
import { ClaimBulkUploadComponent } from "./claim-assistance/claim-bulk-upload/claim-bulk-upload.component";

import { TodayDashboardComponent } from "./today-dashboard/today-dashboard.component";

const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "today-dashboard", component: TodayDashboardComponent },
  { path: "claim-assistance/policy-list", component: ClaimAssistanceComponent },
  {
    path: "claim-assistance/create-request/:Quotation_Id/:Company_Name",
    component: CreateClaimRequestComponent,
  },
  // { path: "claim-assistance/all-requests", component: ClaimRequestsComponent },
  { path: "manage-requests/claims", component: ClaimRequestsComponent },
  {
    path: "claim-assistance/view-claim/:Claim_Id",
    component: ViewClaimComponent,
  },
  { path: "offline-quote", component: OfflineQuoteComponent },
  { path: "endorsement-request", component: EndorsementRequestComponent },
  { path: "survey-request", component: SurveyRequestComponent },
  { path: "cancellation", component: CancellationComponent },
  { path: "renewal", component: RenewalComponent },
  { path: "payin-payout", component: PayinPayoutComponent },
  { path: "agents-payin", component: AddPayinAgentWiseComponent },
  { path: "payin-payout/add-payin/agent-wise", component: AddPayinComponent },
  { path: "payin-payout/add-payin/all", component: AddPayinComponent },
  { path: "payin-payout/payout-posting", component: PayoutPostingComponent },
  { path: "payin-payout/agents-tds", component: TdsComponent },
  { path: "payout/statement", component: StatementComponent },
  {
    path: "payout-request/pending-for-accounts",
    component: PayoutRequestComponent,
  },
  {
    path: "payout-request/pending-for-banking",
    component: PayoutRequestComponent,
  },
  { path: "payout-request/final-approved", component: PayoutRequestComponent },
  { path: "assets-management", component: AssetsManagementComponent },

  {
    path: "report-management/employee-report",
    component: AdminManagementComponent,
  },
  { path: "report-management/posp-report", component: PospReportComponent },
  {
    path: "report-management/bussiness-report",
    component: BussinessReportComponent,
  },
  {
    path: "report-management/employee-rights/:Emp_Id",
    component: EmployeeRightsComponent,
  },
  { path: "Agent-mapping/Bulk-mapping", component: BulkMappingComponent },

  { path: "recovery", component: RecoveryComponent },
  { path: "cash-report", component: CashReportComponent },

  {
    path: "report-management/bulk-claim-upload",
    component: ClaimBulkUploadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
