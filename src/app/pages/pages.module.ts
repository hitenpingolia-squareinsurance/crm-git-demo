import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { MatDialogModule } from "@angular/material/dialog";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PagesRoutingModule } from "./pages-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { OfflineQuoteComponent } from "./offline-quote/offline-quote.component";
import { EndorsementRequestComponent } from "./endorsement-request/endorsement-request.component";
import { SurveyRequestComponent } from "./survey-request/survey-request.component";
import { CancellationComponent } from "./cancellation/cancellation.component";
import { AssetsManagementComponent } from "./assets-management/assets-management.component";
import { AdminManagementComponent } from "./admin-management/admin-management.component";
import { ClaimAssistanceComponent } from "./claim-assistance/claim-assistance.component";
import { CreateClaimRequestComponent } from "./claim-assistance/create-claim-request/create-claim-request.component";
import { ClaimRequestsComponent } from "./claim-assistance/claim-requests/claim-requests.component";

import { ViewClaimComponent } from "./claim-assistance/view-claim/view-claim.component";

import { EmployeeRightsComponent } from "./admin-management/employee-rights/employee-rights.component";
import { RenewalComponent } from "./renewal/renewal.component";
import { BussinessReportComponent } from "./admin-management/bussiness-report/bussiness-report.component";
import { PospReportComponent } from "./admin-management/posp-report/posp-report.component";
import { PayinPayoutComponent } from "./payin-payout/payin-payout.component";
import { AddPayinComponent } from "./payin-payout/add-payin/add-payin.component";
import { PayoutPostingComponent } from "./payin-payout/payout-posting/payout-posting.component";
import { PayoutRequestComponent } from "./payin-payout/payout-request/payout-request.component";
import { TdsComponent } from "./payin-payout/tds/tds.component";
import { StatementComponent } from "./payin-payout/statement/statement.component";
import { AddPayinAgentWiseComponent } from "./payin-payout/add-payin-agent-wise/add-payin-agent-wise.component";
import { RecoveryComponent } from "./recovery/recovery.component";
import { DetailsRmBoxComponent } from "./details-rm-box/details-rm-box.component";
import { StatusBoxComponent } from "./claim-assistance/status-box/status-box.component";
import { ClaimDetailsComponent } from "./../modals/claim-details/claim-details.component";
import { PolicydetailsComponent } from "../modals/policydetails/policydetails.component";
import { SharedModule } from "../shared/shared.module";
import { EditClaimComponent } from "./claim-assistance/edit-claim/edit-claim.component";
import { CashReportComponent } from "./cash-report/cash-report.component";
import { BulkMappingComponent } from "./bulk-mapping/bulk-mapping.component";

import { ChartsModule, ThemeService } from "ng2-charts";
import { ClaimBulkUploadComponent } from "./claim-assistance/claim-bulk-upload/claim-bulk-upload.component";
import { TodayDashboardComponent } from "./today-dashboard/today-dashboard.component";

@NgModule({
  declarations: [
    DashboardComponent,
    ClaimBulkUploadComponent,
    PolicydetailsComponent,
    CashReportComponent,
    ClaimDetailsComponent,
    ClaimAssistanceComponent,
    OfflineQuoteComponent,
    EndorsementRequestComponent,
    SurveyRequestComponent,
    CancellationComponent,
    AssetsManagementComponent,
    AdminManagementComponent,

    CreateClaimRequestComponent,
    ClaimRequestsComponent,
    ViewClaimComponent,
    EditClaimComponent,

    EmployeeRightsComponent,
    RenewalComponent,
    BussinessReportComponent,
    PospReportComponent,
    PayinPayoutComponent,
    AddPayinComponent,
    PayoutPostingComponent,
    PayoutRequestComponent,
    TdsComponent,
    StatementComponent,
    AddPayinAgentWiseComponent,
    RecoveryComponent,
    DetailsRmBoxComponent,
    StatusBoxComponent,
    BulkMappingComponent,
    TodayDashboardComponent,
  ],
  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    DataTablesModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDialogModule,
    ChartsModule,
  ],

  providers: [ThemeService],
  entryComponents: [
    DetailsRmBoxComponent,
    StatusBoxComponent,
    ClaimDetailsComponent,
    EditClaimComponent,

    PolicydetailsComponent,
  ],
})
export class PagesModule {}
