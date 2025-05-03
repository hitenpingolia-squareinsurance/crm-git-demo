import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { initializeApp } from "firebase/app";
initializeApp(environment.firebase);

import { TimepickerModule } from "ngx-bootstrap/timepicker";

import { AppRoutingModule } from "./app-routing.module";
import { PagesModule } from "./pages/pages.module";
import { AccountModule } from "./account/account.module";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./common/header/header.component";
import { SidebarComponent } from "./common/sidebar/sidebar.component";
import { FooterComponent } from "./common/footer/footer.component";

import { ToastrModule } from "ngx-toastr";

import { ApiService } from "./providers/api.service";
import { SocketioService } from "./providers/socketio.service";
import { PusherService } from "./providers/pusher.service";
import { FcmService } from "./providers/fcm.service";
import { HttpClientModule } from "@angular/common/http";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { environment } from "../environments/environment";

import { LogoutwebComponent } from "./common/logoutweb/logoutweb.component";

import { DetailspopupsComponent } from "./jobdetails/detailspopups/detailspopups.component";

import { SurveyModule } from "./survey/survey.module";
import { CancellationModule } from "./cancellation/cancellation.module";
import { EndosmentModule } from "./endosment/endosment.module";
import { DataTablesModule } from "angular-datatables";
// import { ClipboardModule } from 'ngx-clipboard';

import { ViewFollowUpsComponent } from "./leads/view-follow-ups/view-follow-ups.component";
import { CKEditorModule } from "ckeditor4-angular";

import { AddPostersComponent } from "./website-section/posters/add-posters/add-posters.component";
import { AddHospitalListComponent } from "./website-health-section/Hospital-list/add-hospital-list/add-hospital-list.component";
import { AddProductDetailsComponent } from "./website-section/product-details/add-product-details/add-product-details.component";
import { AddPlanBenifitComponent } from "./website-health-section/plan-benifit/add-plan-benifit/add-plan-benifit.component";
import { AddCurrentOpeningComponent } from "./career/current-opening/add-current-opening/add-current-opening.component";
import { AddBourcherHealthComponent } from "./website-health-section/bourcher_health/add-bourcher-health/add-bourcher-health.component";

//Data Master as Per Bms

import { BrokerComponent } from "./data-master/broker/broker.component";
import { AddBrokerComponent } from "./data-master/broker/add-broker/add-broker.component";
import { EditBrokerComponent } from "./data-master/broker/edit-broker/edit-broker.component";

import { LobComponent } from "./data-master/lob/lob.component";
import { AddLobComponent } from "./data-master/lob/add-lob/add-lob.component";
import { EditLobComponent } from "./data-master/lob/edit-lob/edit-lob.component";

import { SegmentComponent } from "./data-master/segment/segment.component";
import { AddSegmentComponent } from "./data-master/segment/add-segment/add-segment.component";
import { EditSegmentComponent } from "./data-master/segment/edit-segment/edit-segment.component";

import { ClassComponent } from "./data-master/class/class.component";
import { AddClassComponent } from "./data-master/class/add-class/add-class.component";
import { EditClassComponent } from "./data-master/class/edit-class/edit-class.component";

import { ProductComponent } from "./data-master/product/product.component";
import { AddProductComponent } from "./data-master/product/add-product/add-product.component";
import { EditProductComponent } from "./data-master/product/edit-product/edit-product.component";

import { SubProductComponent } from "./data-master/sub-product/sub-product.component";
import { AddSubProductComponent } from "./data-master/sub-product/add-sub-product/add-sub-product.component";
import { EditSubProductComponent } from "./data-master/sub-product/edit-sub-product/edit-sub-product.component";

import { InsCompaniesComponent } from "./data-master/ins-companies/ins-companies.component";
import { AddInsCompanyComponent } from "./data-master/ins-companies/add-ins-company/add-ins-company.component";
import { EditInsCompanyComponent } from "./data-master/ins-companies/edit-ins-company/edit-ins-company.component";

import { SubInsCompaniesComponent } from "./data-master/sub-ins-companies/sub-ins-companies.component";
import { AddSubInsCompaniesComponent } from "./data-master/sub-ins-companies/add-sub-ins-companies/add-sub-ins-companies.component";
import { EditSubInsCompaniesComponent } from "./data-master/sub-ins-companies/edit-sub-ins-companies/edit-sub-ins-companies.component";

import { RtoComponent } from "./data-master/rto/rto.component";
import { AddRtoComponent } from "./data-master/rto/add-rto/add-rto.component";
import { EditRtoComponent } from "./data-master/rto/edit-rto/edit-rto.component";

import { PaymentTowardsComponent } from "./data-master/payment-towards/payment-towards.component";
import { AddPaymentTowardsComponent } from "./data-master/payment-towards/add-payment-towards/add-payment-towards.component";
import { EditPaymentTowardsComponent } from "./data-master/payment-towards/edit-payment-towards/edit-payment-towards.component";

import { VehicleComponent } from "./data-master/vehicle/vehicle.component";
import { AddVehicleComponent } from "./data-master/vehicle/add-vehicle/add-vehicle.component";
import { EditVehicleComponent } from "./data-master/vehicle/edit-vehicle/edit-vehicle.component";

import { ManageSubClassMissingMakeModelComponent } from "./data-master/manage-sub-class-missing-make-model/manage-sub-class-missing-make-model.component";

import { PospUpdateStatusComponent } from "./pos-management/posp-update-status/posp-update-status.component";
import { AssetsModule } from "./assets/assets.module";

import { EditQuantityComponent } from "./AssetsManagement/edit-quantity/edit-quantity.component";
import { InventoryLogComponent } from "./AssetsManagement/inventory-log/inventory-log.component";
import { ItemDetailsComponent } from "./inventory/item-details/item-details.component";
import { FollowUpProductComponent } from "./website-section/products/follow-up-product/follow-up-product.component";
import { ActionUnknownWindowComponent } from "./unknown-window/action-unknown-window/action-unknown-window.component";

import { EditSalaryUpdateDateComponent } from "./modals/goal-management/edit-salary-update-date/edit-salary-update-date.component";
import { GemsTransactionComponent } from "./modals/gems-transaction/gems-transaction.component";
import { ViewgemsdetailspopupComponent } from "./modals/viewgemsdetailspopup/viewgemsdetailspopup.component";
import { ManageOldRightsComponent } from "./modals/manage-old-rights/manage-old-rights.component";
import { GetRmDetailsComponent } from "./modals/get-rm-details/get-rm-details.component";
import { GroupSrMembersPaComponent } from "./modals/sr-related/pa/group-sr-members-pa/group-sr-members-pa.component";
import { EditMemberPaComponent } from "./modals/sr-related/pa/edit-member-pa/edit-member-pa.component";
import { DeleteMemberPaComponent } from "./modals/sr-related/pa/delete-member-pa/delete-member-pa.component";
import { BulkUploadExcelPaComponent } from "./modals/sr-related/pa/bulk-upload-excel-pa/bulk-upload-excel-pa.component";
import { AddNewMemberPaComponent } from "./modals/sr-related/pa/add-new-member-pa/add-new-member-pa.component";
import { DownloadProjectionReportsComponent } from "./modals/projection-target/download-projection-reports/download-projection-reports.component";
import { AddNewHolidayComponent } from "./modals/projection-target/add-new-holiday/add-new-holiday.component";
import { EditLwpComponent } from "./modals/goal-management/edit-lwp/edit-lwp.component";
import { ViewGivenTargetComponent } from "./modals/goal-management/view-given-target/view-given-target.component";
import { CreateMisReportNameComponent } from "./modals/create-mis-report-name/create-mis-report-name.component";
import { SalaryRemarksTrackComponent } from "./modals/goal-management/salary-remarks-track/salary-remarks-track.component";
import { UploadFinalSalaryComponent } from "./modals/goal-management/upload-final-salary/upload-final-salary.component";

import { GroupSrMembersHealthComponent } from "./modals/health-sr/group-sr-members-health/group-sr-members-health.component";
import { AddNewMemberHealthComponent } from "./modals/health-sr/add-new-member-health/add-new-member-health.component";
import { DeleteMemberHealthComponent } from "./modals/health-sr/delete-member-health/delete-member-health.component";
import { EditMemberHealthComponent } from "./modals/health-sr/edit-member-health/edit-member-health.component";
import { BulkUploadExcelHealthComponent } from "./modals/health-sr/bulk-upload-excel-health/bulk-upload-excel-health.component";
import { ViewDetailsModalComponent } from "./survey/view-details-modal/view-details-modal.component";

import { MandateLetterFormComponent } from "./modals/mandate-letter/mandate-letter-form/mandate-letter-form.component";
import { MandateLetterQcComponent } from "./modals/mandate-letter/mandate-letter-qc/mandate-letter-qc.component";

import { UpdateProjectionTargetComponent } from "./modals/projection-target/update-projection-target/update-projection-target.component";
import { ProjectionTargetLogComponent } from "./modals/projection-target/projection-target-log/projection-target-log.component";
import { OrganisationListComponent } from "./modals/goal-management/organisation-list/organisation-list.component";
import { RenewalonlinequoteCreationComponent } from "./modals/renewalonlinequote-creation/renewalonlinequote-creation.component";

import { SearchPipe } from "./search.pipe";
import { FollowUpLeadsComponent } from "./modals/follow-up-leads/follow-up-leads.component";
import { PosDetailsComponent } from "./modals/pos-details/pos-details.component";
import { PoliciesDataComponent } from "./modals/policies-data/policies-data.component";
import { ViewDashboardPoupupComponent } from "./modals/view-dashboard-poupup/view-dashboard-poupup.component";
import { RenewalnewgadiComponent } from "./modals/renewalnewgadi/renewalnewgadi.component";
import { RenewalnoticeComponent } from "./modals/renewalnotice/renewalnotice.component";
import { ViewEndorsementDetailsComponent } from "./modals/view-endorsement-details/view-endorsement-details.component";
import { BulkrenewalnoticeComponent } from "./modals/bulkrenewalnotice/bulkrenewalnotice.component";
import { ShareUrlComponent } from "./modals/share-url/share-url.component";
import { OfflineQuoteDetailsComponent } from "./modals/offline-quote-details/offline-quote-details.component";
import { DailyTrackingCircleFollowupComponent } from "./modals/daily-tracking-circle-followup/daily-tracking-circle-followup.component";
import { FollowUpTrackComponent } from "./modals/daily-tracking-circle-followup/follow-up-track/follow-up-track.component";
import { PosCategorizationComponent } from "./modals/pos-categorization/pos-categorization.component";
import { AddNocComponent } from "./noc/add-noc/add-noc.component";
import { ConfrimPaymentMethodComponent } from "./modals/confrim-payment-method/confrim-payment-method.component";

import { SrStatusActionComponent } from "./modals/sr-status-action/sr-status-action.component";
import { SrCancelActionComponent } from "./modals/sr-cancel-action/sr-cancel-action.component";
import { DocumentsComponent } from "./useragent/documents/documents.component";

import { LifeRenewalActionComponent } from "./modals/life-renewal-action/life-renewal-action.component";
import { LifeRenewalsTrackComponent } from "./modals/life-renewals-track/life-renewals-track.component";
import { ManageRightsComponent } from "./modals/manage-rights/manage-rights.component";
import { AddProspectCallComponent } from "./modals/daily-tracking-circle-followup/add-prospect-call/add-prospect-call.component";

import { TargetDetailsComponent } from "./modals/goal-management/target-details/target-details.component";
import { EditTargetComponent } from "./modals/goal-management/edit-target/edit-target.component";
import { SalaryRemarksComponent } from "./modals/goal-management/salary-remarks/salary-remarks.component";
import { LogTrackFormComponent } from "./modals/log-track-form/log-track-form.component";
// import { GemsRemarkComponent } from "./gems-wallet/gems-remark/gems-remark.component";
import { EditGivenTargetComponent } from "./modals/goal-management/edit-given-target/edit-given-target.component";
import { UpdatePaymentFrequencyComponent } from "./modals/life-renewals/update-payment-frequency/update-payment-frequency.component";
import { EmployeeDetailsComponent } from "./modals/employee-details/employee-details.component";
import { UpdateGivenSalaryComponent } from "./modals/goal-management/update-given-salary/update-given-salary.component";

import { GroupSrMembersComponent } from "./modals/life-sr/group-sr-members/group-sr-members.component";
import { AddNewMemberComponent } from "./modals/life-sr/add-new-member/add-new-member.component";
import { DeleteMemberComponent } from "./modals/life-sr/delete-member/delete-member.component";
import { UploadBulkExcelComponent } from "./modals/life-sr/upload-bulk-excel/upload-bulk-excel.component";
import { EditMemberComponent } from "./modals/life-sr/edit-member/edit-member.component";
import { ViewSrDetailsComponent } from "./modals/view-sr-details/view-sr-details.component";
import { ViewEmployeeDetailsComponent } from "./modals/view-employee-details/view-employee-details.component";
import { SrPostingViewGroupWiseComponent } from "./modals/sr-posting-view-group-wise/sr-posting-view-group-wise.component";
import { EditSrPayoutComponent } from "./modals/edit-sr-payout/edit-sr-payout.component";
import { DownloadingViewComponent } from "./modals/downloading-view/downloading-view.component";
import { AddRecoveryComponent } from "./modals/add-recovery/add-recovery.component";
import { FollowUpReportComponent } from "./modals/follow-up-report/follow-up-report.component";
import { SessionExpiredComponent } from "./modals/session-expired/session-expired.component";

//BMS brokerage modals
//import { EditSrComponent } from './modals/brokerage/edit-sr/edit-sr.component';
import { AdminSRCancelComponent } from "./modals/brokerage/admin-srcancel/admin-srcancel.component";
import { SrEditByRightComponent } from "./modals/brokerage/sr-edit-by-right/sr-edit-by-right.component";
//import { CreateMisReportNameComponent } from './modals/brokerage/create-mis-report-name/create-mis-report-name.component';
import { EditsrpayoutComponent } from "./modals/brokerage/editsrpayout/editsrpayout.component";
import { DownloadingViewBmsComponent } from "./modals/brokerage/downloading-view-bms/downloading-view-bms.component";
import { PayinformmodelComponent } from "./modals/brokerage/payinformmodel/payinformmodel.component";
import { AddSrRecoveryReportComponent } from "./modals/brokerage/add-sr-recovery-report/add-sr-recovery-report.component";
import { PayinRmaDetailsComponent } from "./modals/brokerage/payin-rma-details/payin-rma-details.component";
import { BrokrageRequestLoaderComponent } from "./modals/brokerage/brokrage-request-loader/brokrage-request-loader.component";
import { SrPostingViewGroupWiseBmsComponent } from "./modals/brokerage/sr-posting-view-group-wise-bms/sr-posting-view-group-wise-bms.component";
import { UpdateUtrNoComponent } from "./modals/brokerage/update-utr-no/update-utr-no.component";
import { V2PayInDataviewComponent } from "./modals/brokerage/v2-pay-in-dataview/v2-pay-in-dataview.component";
import { V2PayInRequestUpdateComponent } from "./modals/brokerage/v2-pay-in-request-update/v2-pay-in-request-update.component";
import { EditSrComponent } from "./modals/brokerage/edit-sr/edit-sr.component";
import { GenerateInvoiceComponent } from "./modals/brokerage/generate-invoice/generate-invoice.component";
import { AddPayorComponent } from "./modals/brokerage/add-payor/add-payor.component";

import { OperationManageRightsComponent } from "./rights/operation-manage-rights/operation-manage-rights.component";
//BMS brokerage modals
import { AddAdvisorComponent } from "./modals/add-advisor/add-advisor.component";

import { LifeEndorsementTrackComponent } from "./modals/life-sr/life-endorsement-track/life-endorsement-track.component";
import { RaiseClaimComponent } from "./modals/raise-claim/raise-claim.component";
import { UpdatePospReportingComponent } from "./mypos/update-posp-reporting/update-posp-reporting.component";
import { SrExportComponent } from "./reports/sr-export/sr-export.component";
import { DownloadingSrComponent } from "./reports/downloading-sr/downloading-sr.component";
import { ClaimFormComponent } from "./claim/claim-form/claim-form.component";
import { DatePipe } from "@angular/common";
import { ViewHealthOfflineDetailsComponent } from "./modals/view-health-offline-details/view-health-offline-details.component";
import { AgentsReportDetailsComponent } from "./modals/dsr-related/agents-report-details/agents-report-details.component";
import { ConversationalSettingsComponent } from "./pos-management/conversational-settings/conversational-settings.component";
import { PmsOtpPopupComponent } from "./pms-otp-popup/pms-otp-popup.component";
import { PmsOtpService } from "./providers/pmsotp.service";
import { PmsOtpGuard } from "./guards/pmsotp.guard";
import { TransferLobComponent } from "./posp-reporting/transfer-lob/transfer-lob.component";
import { QcpdfDetailsComponent } from "./modals/qcpdf-details/qcpdf-details.component";
import { EditPayoutRmComponent } from "./modals/edit-payout-rm/edit-payout-rm.component";
import { GeotagComponent } from "./modals/geotag/geotag.component";
import { ExtraPayoutDetailsComponent } from "./modals/extra-payout-details/extra-payout-details.component";
import { UpdatationMisReportNameComponent } from "./modals/brokerage/updatation-mis-report-name/updatation-mis-report-name.component";

import { AgentDetailsViewComponent } from "./modals/agent-details-view/agent-details-view.component";
import { AgentOrcComponent } from "./modals/agent-orc/agent-orc.component";
import { PoPriorityLogsComponent } from "./modals/po-priority-logs/po-priority-logs.component";
import { GemsDetailsViewComponent } from "./modals/gems-details-view/gems-details-view.component";
import { AddprimerequestpopupComponent } from "./modals/addprimerequestpopup/addprimerequestpopup.component";
import { MergeCodeComponent } from "./modals/merge-code/merge-code.component";
import { FranchiseRightsComponent } from "./modals/franchise-rights/franchise-rights.component";
import { AgentStatusActionComponent } from "./modals/agent-status-action/agent-status-action.component";
import { AgreementActiveInactiveComponent } from "./modals/agreement-active-inactive/agreement-active-inactive.component";
import { AgentOrcBanksDetailsComponent } from "./modals/agent-orc-banks-details/agent-orc-banks-details.component";
import { HealthRenewalsTrackComponent } from "./modals/health-renewals-track/health-renewals-track.component";
import { HealthRenewalActionComponent } from "./modals/health-renewal-action/health-renewal-action.component";
import { UpdateSalaryDetailsComponent } from "./modals/goal-management/update-salary-details/update-salary-details.component";
import { PartnerDirectoryPopupComponent } from "./pos-directory/partner-directory-popup/partner-directory-popup.component";
import { SrRejectedComponent } from "./modals/sr-rejected/sr-rejected.component";
import { SrCustomUpdationReportDetailsComponent } from "./modals/sr-custom-updation-report-details/sr-custom-updation-report-details.component";

import { RmEmployeesComponent } from "./employee/rm-employees/rm-employees.component";

@NgModule({
  declarations: [
    LifeEndorsementTrackComponent,
    AddAdvisorComponent,
    ViewHealthOfflineDetailsComponent,
    ClaimFormComponent,
    ConversationalSettingsComponent,
    DownloadingSrComponent,
    UpdatePospReportingComponent,
    SrExportComponent,
    AppComponent,
    EditLwpComponent,
    ViewGivenTargetComponent,
    ActionUnknownWindowComponent,
    AddNewHolidayComponent,
    UpdateProjectionTargetComponent,
    EditQuantityComponent,
    DownloadProjectionReportsComponent,
    FollowUpProductComponent,
    ProjectionTargetLogComponent,
    SearchPipe,
    PmsOtpPopupComponent,
    OrganisationListComponent,
    CreateMisReportNameComponent,
    SalaryRemarksTrackComponent,
    UploadFinalSalaryComponent,
    MandateLetterFormComponent,
    MandateLetterQcComponent,
    EditSalaryUpdateDateComponent,
    ViewgemsdetailspopupComponent,
    UpdateGivenSalaryComponent,
    //DATAmASTER as PER BMS
    BrokerComponent,
    AddBrokerComponent,
    EditBrokerComponent,
    LobComponent,
    AddLobComponent,
    EditLobComponent,
    SegmentComponent,
    AddSegmentComponent,
    EditSegmentComponent,
    ClassComponent,
    AddClassComponent,
    EditClassComponent,
    ProductComponent,
    AddProductComponent,
    EditProductComponent,
    SubProductComponent,
    AddSubProductComponent,
    EditSubProductComponent,
    InsCompaniesComponent,
    AddInsCompanyComponent,
    EditInsCompanyComponent,
    RtoComponent,
    AddRtoComponent,
    EditRtoComponent,
    PaymentTowardsComponent,
    AddPaymentTowardsComponent,
    EditPaymentTowardsComponent,
    SubInsCompaniesComponent,
    AddSubInsCompaniesComponent,
    EditSubInsCompaniesComponent,
    VehicleComponent,
    AddVehicleComponent,
    EditVehicleComponent,
    TargetDetailsComponent,
    EditTargetComponent,
    SalaryRemarksComponent,
    // GemsRemarkComponent,
    EmployeeDetailsComponent,
    HeaderComponent,
    EditGivenTargetComponent,
    SidebarComponent,
    FooterComponent,
    ViewSrDetailsComponent,
    LifeRenewalActionComponent,
    LifeRenewalsTrackComponent,
    ViewEmployeeDetailsComponent,
    DocumentsComponent,
    SrPostingViewGroupWiseComponent,
    ConfrimPaymentMethodComponent,
    DailyTrackingCircleFollowupComponent,
    PosCategorizationComponent,
    FollowUpTrackComponent,
    SrStatusActionComponent,
    SrCancelActionComponent,
    EditSrPayoutComponent,
    AddBourcherHealthComponent,
    DownloadingViewComponent,
    AddHospitalListComponent,
    AddPlanBenifitComponent,
    AddCurrentOpeningComponent,
    AddRecoveryComponent,
    AddPostersComponent,
    AddNocComponent,
    LogoutwebComponent,
    ViewFollowUpsComponent,
    SessionExpiredComponent,
    BulkrenewalnoticeComponent,
    AddProductDetailsComponent,
    DetailspopupsComponent,
    FollowUpReportComponent,
    PosDetailsComponent,
    PoliciesDataComponent,
    ViewDashboardPoupupComponent,
    RenewalnewgadiComponent,
    RenewalnoticeComponent,
    ViewEndorsementDetailsComponent,
    ShareUrlComponent,
    OfflineQuoteDetailsComponent,
    FollowUpLeadsComponent,
    ConfrimPaymentMethodComponent,
    ManageRightsComponent,
    AddProspectCallComponent,
    LogTrackFormComponent,
    UpdatePaymentFrequencyComponent,
    EmployeeDetailsComponent,
    GemsTransactionComponent,
    ManageOldRightsComponent,
    GroupSrMembersComponent,
    AddNewMemberComponent,
    DeleteMemberComponent,
    UploadBulkExcelComponent,
    EditMemberComponent,
    GetRmDetailsComponent,
    ManageSubClassMissingMakeModelComponent,
    GroupSrMembersHealthComponent,
    AddNewMemberHealthComponent,
    DeleteMemberHealthComponent,
    EditMemberHealthComponent,
    BulkUploadExcelHealthComponent,
    ViewDetailsModalComponent,
    ItemDetailsComponent,
    RenewalonlinequoteCreationComponent,
    InventoryLogComponent,
    PospUpdateStatusComponent,
    GroupSrMembersPaComponent,
    EditMemberPaComponent,
    DeleteMemberPaComponent,
    BulkUploadExcelPaComponent,
    AddNewMemberPaComponent,

    AdminSRCancelComponent,
    SrEditByRightComponent,
    EditsrpayoutComponent,
    DownloadingViewBmsComponent,
    PayinformmodelComponent,
    AddSrRecoveryReportComponent,
    PayinRmaDetailsComponent,
    BrokrageRequestLoaderComponent,
    SrPostingViewGroupWiseBmsComponent,
    UpdateUtrNoComponent,
    V2PayInDataviewComponent,
    V2PayInRequestUpdateComponent,
    EditSrComponent,
    GenerateInvoiceComponent,
    AddPayorComponent,
    OperationManageRightsComponent,
    RaiseClaimComponent,
    AgentsReportDetailsComponent,
    TransferLobComponent,
    QcpdfDetailsComponent,
    EditPayoutRmComponent,
    GeotagComponent,
    ExtraPayoutDetailsComponent,
    UpdatationMisReportNameComponent,
    AgentDetailsViewComponent,
    AgentOrcComponent,
    PoPriorityLogsComponent,
    GemsDetailsViewComponent,
    AddprimerequestpopupComponent,
    MergeCodeComponent,
    FranchiseRightsComponent,
    AgentStatusActionComponent,
    AgreementActiveInactiveComponent,
    AgentOrcBanksDetailsComponent,
    HealthRenewalsTrackComponent,
    HealthRenewalActionComponent,
    UpdateSalaryDetailsComponent,
    PartnerDirectoryPopupComponent,
    SrRejectedComponent,
    SrCustomUpdationReportDetailsComponent,
    RmEmployeesComponent
  ],
  imports: [
    BsDatepickerModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    TimepickerModule.forRoot(),
    ToastrModule.forRoot(),
    PagesModule,
    AccountModule,
    SurveyModule,
    CancellationModule,
    DataTablesModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    CKEditorModule,
    BrowserAnimationsModule,
    EndosmentModule,
    NgMultiSelectDropDownModule,
    AssetsModule,
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ApiService,
    SocketioService,
    PusherService,
    NgxSpinnerService,
    FcmService,
    DatePipe,
    PmsOtpService,
    PmsOtpGuard,
  ],

  entryComponents: [
    ActionUnknownWindowComponent,

    AddNewHolidayComponent,
    OperationManageRightsComponent,
    LifeEndorsementTrackComponent,
    RaiseClaimComponent,
    ViewSrDetailsComponent,
    InventoryLogComponent,
    ItemDetailsComponent,
    GroupSrMembersPaComponent,
    EditQuantityComponent,
    EditMemberPaComponent,
    DeleteMemberPaComponent,
    BulkUploadExcelPaComponent,
    AddNewMemberPaComponent,
    RenewalonlinequoteCreationComponent,
    CreateMisReportNameComponent,
    MandateLetterFormComponent,
    MandateLetterQcComponent,
    ViewFollowUpsComponent,
    FollowUpLeadsComponent,
    FollowUpReportComponent,
    ViewEmployeeDetailsComponent,
    SrPostingViewGroupWiseComponent,
    EditSrPayoutComponent,
    DownloadingViewComponent,
    DocumentsComponent,
    AddRecoveryComponent,
    SessionExpiredComponent,
    BulkrenewalnoticeComponent,
    ShareUrlComponent,
    OfflineQuoteDetailsComponent,
    PosDetailsComponent,
    AddNocComponent,
    SrStatusActionComponent,
    SrCancelActionComponent,
    DailyTrackingCircleFollowupComponent,
    PosCategorizationComponent,
    FollowUpTrackComponent,
    AddBourcherHealthComponent,
    AddPlanBenifitComponent,
    ConfrimPaymentMethodComponent,
    AddHospitalListComponent,
    AddCurrentOpeningComponent,
    AddPostersComponent,
    AddProductDetailsComponent,
    PoliciesDataComponent,
    ViewDashboardPoupupComponent,
    RenewalnewgadiComponent,
    ViewEndorsementDetailsComponent,
    RenewalnoticeComponent,
    LifeRenewalActionComponent,
    UpdateGivenSalaryComponent,
    LifeRenewalsTrackComponent,
    EditGivenTargetComponent,
    EmployeeDetailsComponent,
    GemsTransactionComponent,
    ViewgemsdetailspopupComponent,
    ManageRightsComponent,
    AddProspectCallComponent,
    TargetDetailsComponent,
    EditTargetComponent,
    SalaryRemarksComponent,
    LogTrackFormComponent,
    EditSalaryUpdateDateComponent,
    // GemsRemarkComponent,
    ManageOldRightsComponent,
    UpdatePaymentFrequencyComponent,
    GroupSrMembersComponent,
    AddNewMemberComponent,
    DeleteMemberComponent,
    UploadBulkExcelComponent,
    EditMemberComponent,
    GetRmDetailsComponent,
    SalaryRemarksTrackComponent,
    UploadFinalSalaryComponent,
    GroupSrMembersHealthComponent,
    AddNewMemberHealthComponent,
    DeleteMemberHealthComponent,
    EditMemberHealthComponent,
    BulkUploadExcelHealthComponent,
    ViewDetailsModalComponent,
    UpdateProjectionTargetComponent,
    ProjectionTargetLogComponent,
    OrganisationListComponent,
    EditLwpComponent,
    ViewGivenTargetComponent,
    PospUpdateStatusComponent,
    DownloadProjectionReportsComponent,
    FollowUpProductComponent,
    AdminSRCancelComponent,
    SrEditByRightComponent,
    EditsrpayoutComponent,
    DownloadingViewBmsComponent,
    PayinformmodelComponent,
    AddSrRecoveryReportComponent,
    PayinRmaDetailsComponent,
    BrokrageRequestLoaderComponent,
    SrPostingViewGroupWiseBmsComponent,
    UpdateUtrNoComponent,
    V2PayInDataviewComponent,
    V2PayInRequestUpdateComponent,
    EditSrComponent,
    GenerateInvoiceComponent,
    AddPayorComponent,
    UpdatePospReportingComponent,
    SrExportComponent,
    DownloadingSrComponent,
    ClaimFormComponent,
    ViewHealthOfflineDetailsComponent,
    AddAdvisorComponent,
    AgentsReportDetailsComponent,
    ConversationalSettingsComponent,
    PmsOtpPopupComponent,
    TransferLobComponent,
    QcpdfDetailsComponent,
    EditPayoutRmComponent,
    GeotagComponent,
    ExtraPayoutDetailsComponent,
    UpdatationMisReportNameComponent,
    AgentDetailsViewComponent,
    AgentOrcComponent,
    PoPriorityLogsComponent,
    GemsDetailsViewComponent,
    AddprimerequestpopupComponent,
    MergeCodeComponent,
    FranchiseRightsComponent,
    AgentStatusActionComponent,
    AgreementActiveInactiveComponent,
    AgentOrcBanksDetailsComponent,
    HealthRenewalsTrackComponent,
    HealthRenewalActionComponent,
    UpdateSalaryDetailsComponent,
    PartnerDirectoryPopupComponent,
    SrRejectedComponent,
    SrCustomUpdationReportDetailsComponent,
    RmEmployeesComponent,
  ],

  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
