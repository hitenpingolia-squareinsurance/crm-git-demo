import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LogoutwebComponent } from "./common/logoutweb/logoutweb.component";

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

import { PmsOtpGuard } from "./guards/pmsotp.guard";

const routes: Routes = [
  {
    path: "vahan",
    loadChildren: () =>
      import("./vahan/vahan.module").then((m) => m.VahanModule),
  },
  {
    path: "ipblock",
    loadChildren: () =>
      import("./ip-block/ip-block.module").then((m) => m.IpBlockModule),
  },
  {
    path: "business-commitment",
    loadChildren: () =>
      import("./business-commit/business-commit.module").then(
        (m) => m.BusinessCommitModule
      ),
  },
  {
    path: "expenses",
    loadChildren: () =>
      import(
        "./goal-management-module/expense-section/expense-section.module"
      ).then((m) => m.ExpenseSectionModule),
  },
  {
    path: "meeting_request",
    loadChildren: () =>
      import("./meeting-request/meeting-request.module").then(
        (m) => m.MeetingRequestModule
      ),
  },

  {
    path: "regulatory-report",
    loadChildren: () =>
      import("./saiba/saiba.module").then((m) => m.SaibaModule),
  },

  {
    path: "data-directory",
    loadChildren: () =>
      import("./data-directory/data-directory.module").then(
        (m) => m.DataDirectoryModule
      ),
  },

  {
    path: "Advisors",
    loadChildren: () =>
      import("./advisors/advisors.module").then((m) => m.AdvisorsModule),
  },

  {
    path: "management-reports",
    loadChildren: () =>
      import("./management-reports/management-reports.module").then(
        (m) => m.ManagementReportsModule
      ),
  },

  {
    path: "pms-section",
    loadChildren: () =>
      import("./goal-management-module/pms-section/pms-section.module").then(
        (m) => m.PmsSectionModule
      ),
    // canActivate: [PmsOtpGuard],
  },

  {
    path: "lead-management",
    loadChildren: () =>
      import("./lead-management/lead-management.module").then(
        (m) => m.LeadManagementModule
      ),
  },
  {
    path: "appraisals",
    loadChildren: () =>
      import(
        "./goal-management-module/appraisal-section/appraisal-section.module"
      ).then((m) => m.AppraisalSectionModule),
    // canActivate: [PmsOtpGuard],
  },
  {
    path: "posp-reporting",
    loadChildren: () =>
      import("./posp-reporting/posp-reporting.module").then(
        (m) => m.PospReportingModule
      ),
  },

  {
    path: "plan",
    loadChildren: () =>
      import("./plan-detail/plan-detail.module").then(
        (m) => m.PlanDetailModule
      ),
  },

  {
    path: "Logoutweb",
    component: LogoutwebComponent,
  },
  {
    path: "unknow",
    loadChildren: () =>
      import("./unknown-window/unknown-window.module").then(
        (m) => m.UnknownWindowModule
      ),
  },

  {
    path: "knowledge",
    loadChildren: () =>
      import("./knowledge-base/knowledge-base.module").then(
        (m) => m.KnowledgeBaseModule
      ),
  },
  {
    path: "Visiting-card",
    loadChildren: () =>
      import("./visiting-card/visiting-card.module").then(
        (m) => m.VisitingCardModule
      ),
  },
  {
    path: "rfq",
    loadChildren: () => import("./rfq/rfq.module").then((m) => m.RFQModule),
  },
  {
    path: "ticket",
    loadChildren: () =>
      import("./ticket/ticket.module").then((m) => m.TicketModule),
  },
  {
    path: "Tele-Rm",
    loadChildren: () =>
      import("./tele-rm/tele-rm.module").then((m) => m.TeleRmModule),
  },
  {
    path: "notification",
    loadChildren: () =>
      import("./notification/notification.module").then(
        (m) => m.NotificationModule
      ),
  },
  {
    path: "Posp-managment",
    loadChildren: () =>
      import("./pos-management/pos-management.module").then(
        (m) => m.PosManagementModule
      ),
  },
  {
    path: "mandate-letter",
    loadChildren: () =>
      import("./mandate-letter/mandate-letter.module").then(
        (m) => m.MandateLetterModule
      ),
  },

  {
    path: "Agent",
    loadChildren: () =>
      import("./postraining/postraining.module").then(
        (m) => m.PostrainingModule
      ),
  },
  {
    path: "meeting",
    loadChildren: () =>
      import("./square-meet/square-meet.module").then(
        (m) => m.SquareMeetModule
      ),
  },
  {
    path: "account",
    loadChildren: () =>
      import("./myaccount/myaccount.module").then((m) => m.MyaccountModule),
  },
  {
    path: "Tele-Rm-Reports",
    loadChildren: () =>
      import("./myaccount/myaccount.module").then((m) => m.MyaccountModule),
  },
  {
    path: "offline-quote",
    loadChildren: () =>
      import("./myaccount/myaccount.module").then((m) => m.MyaccountModule),
  },
  {
    path: "manage-requests",
    loadChildren: () =>
      import("./myaccount/myaccount.module").then((m) => m.MyaccountModule),
  },
  {
    path: "report-management",
    loadChildren: () =>
      import("./pages/pages.module").then((m) => m.PagesModule),
  },
  {
    path: "business-management",
    loadChildren: () =>
      import("./business-management/business-management.module").then(
        (m) => m.BusinessManagementModule
      ),
  },
  {
    path: "brokerage",
    loadChildren: () =>
      import("./brokerage/brokerage.module").then((m) => m.BrokerageModule),
  },
  {
    path: "pay-in",
    loadChildren: () =>
      import("./brokerage/pay-in/pay-in.module").then((m) => m.PayInModule),
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then((m) => m.ProfileModule),
  },
  {
    path: "Pos",
    loadChildren: () =>
      import("./sub-pos-management/sub-pos-management.module").then(
        (m) => m.SubPosManagementModule
      ),
  },
  {
    path: "SrSchedule",
    loadChildren: () =>
      import("./mapping/mapping.module").then((m) => m.MappingModule),
  },
  {
    path: "endosment",
    loadChildren: () =>
      import("./endosment/endosment.module").then((m) => m.EndosmentModule),
  },
  {
    path: "Reports",
    loadChildren: () =>
      import("./reports/reports.module").then((m) => m.ReportsModule),
  },
  {
    path: "Mypos",
    loadChildren: () =>
      import("./mypos/mypos.module").then((m) => m.MyposModule),
  },
  {
    path: "MyClient",
    loadChildren: () =>
      import("./mypos/mypos.module").then((m) => m.MyposModule),
  },
  {
    path: "Tele-Rm-Reports",
    loadChildren: () =>
      import("./mis-reports/mis-reports.module").then(
        (m) => m.MisReportsModule
      ),
  },

  {
    path: "lms",
    loadChildren: () => import("./lms/lms.module").then((m) => m.LMSModule),
  },
  {
    path: "mis-reports",
    loadChildren: () =>
      import("./mis-reports/mis-reports.module").then(
        (m) => m.MisReportsModule
      ),
  },
  {
    path: "irda-reports",
    loadChildren: () =>
      import("./mis-reports/mis-reports.module").then(
        (m) => m.MisReportsModule
      ),
  },
  {
    path: "custom-reports",
    loadChildren: () =>
      import("./custom-report/custom-report.module").then(
        (m) => m.CustomReportModule
      ),
  },
  {
    path: "employee",
    loadChildren: () =>
      import("./employee/employee.module").then((m) => m.EmployeeModule),
  },

  {
    path: "mis-report",
    loadChildren: () =>
      import("./endosment/endosment.module").then((m) => m.EndosmentModule),
  },

  {
    path: "docs-wallet",
    loadChildren: () =>
      import("./docs-wallet/docs-wallet.module").then(
        (m) => m.DocsWalletModule
      ),
  },
  {
    path: "Prime",
    loadChildren: () =>
      import("./prime/prime.module").then((m) => m.PrimeModule),
  },
  {
    path: "Helpdesk",
    loadChildren: () =>
      import("./helpdesk/helpdesk.module").then((m) => m.HelpdeskModule),
  },
  {
    path: "Leads",
    loadChildren: () =>
      import("./leads/leads.module").then((m) => m.LeadsModule),
  },
  {
    path: "assest-manegment",
    loadChildren: () =>
      import("./AssetsManagement/assetsmanagement.module").then(
        (m) => m.AssetsmanagementModule
      ),
  },
  {
    path: "Inventory",
    loadChildren: () =>
      import("./inventory/inventory.module").then((m) => m.InventoryModule),
  },
  {
    path: "contest",
    loadChildren: () =>
      import("./contest/contest.module").then((m) => m.ContestModule),
  },
  {
    path: "assest",
    loadChildren: () =>
      import("./assets/assets.module").then((m) => m.AssetsModule),
  },
  {
    path: "WebsiteSection",
    loadChildren: () =>
      import("./website-section/website-section.module").then(
        (m) => m.WebsiteSectionModule
      ),
  },

  {
    path: "Non-Motor-Section",
    loadChildren: () =>
      import("./website-health-section/website-health-section.module").then(
        (m) => m.WebsiteHealthSectionModule
      ),
  },
  {
    path: "Health-Section",
    loadChildren: () =>
      import("./website-health-section/website-health-section.module").then(
        (m) => m.WebsiteHealthSectionModule
      ),
  },
  {
    path: "mail",
    loadChildren: () =>
      import("./mail-template/mail-template.module").then(
        (m) => m.MailTemplateModule
      ),
  },
  {
    path: "Travel-Section",
    loadChildren: () =>
      import("./website-health-section/website-health-section.module").then(
        (m) => m.WebsiteHealthSectionModule
      ),
  },

  {
    path: "Pa-Section",
    loadChildren: () =>
      import("./website-health-section/website-health-section.module").then(
        (m) => m.WebsiteHealthSectionModule
      ),
  },

  {
    path: "Career",
    loadChildren: () =>
      import("./career/career.module").then((m) => m.CareerModule),
  },
  {
    path: "daily-tracking-circle",
    loadChildren: () =>
      import("./daily-tracking-circle/daily-tracking-circle.module").then(
        (m) => m.DailyTrackingCircleModule
      ),
  },

  {
    path: "cross-selling",
    loadChildren: () =>
      import("./cross-selling/cross-selling.module").then(
        (m) => m.CrossSellingModule
      ),
  },
  {
    path: "noc",
    loadChildren: () => import("./noc/noc.module").then((m) => m.NOCModule),
  },
  {
    path: "exams",
    loadChildren: () =>
      import("./exams/exams.module").then((m) => m.ExamsModule),
  },

  {
    path: "mapping",
    loadChildren: () =>
      import("./squaremaster/squaremaster.module").then(
        (m) => m.SquaremasterModule
      ),
  },
  {
    path: "contact",
    loadChildren: () =>
      import("./mycontacts/mycontacts.module").then((m) => m.MycontactsModule),
  },
  {
    path: "bulk-mail",
    loadChildren: () =>
      import("./bulk-mail/bulk-mail.module").then((m) => m.BulkMailModule),
  },
  {
    path: "notification",
    loadChildren: () =>
      import("./push-notification/push-notification.module").then(
        (m) => m.PushNotificationModule
      ),
  },

  {
    path: "payment-track",
    loadChildren: () =>
      import("./payment-track/payment-track.module").then(
        (m) => m.PaymentTrackModule
      ),
  },
  {
    path: "pos",
    loadChildren: () =>
      import("./pos-enquiry/pos-enquiry.module").then(
        (m) => m.PosEnquiryModule
      ),
  },
  {
    path: "pos",
    loadChildren: () =>
      import("./pos-enquiry/pos-enquiry.module").then(
        (m) => m.PosEnquiryModule
      ),
  },
  {
    path: "sp",
    loadChildren: () =>
      import("./service-provider/service-provider.module").then(
        (m) => m.ServiceProviderModule
      ),
  },
  {
    path: "control-cases",
    loadChildren: () =>
      import("./control-cases/control-cases.module").then(
        (m) => m.ControlCasesModule
      ),
  },
  {
    path: "pms",
    loadChildren: () =>
      import("./goal-management-system/goal-management-system.module").then(
        (m) => m.GoalManagementSystemModule
      ),
  },
  {
    path: "landing",
    loadChildren: () =>
      import("./landing-page/landing-page.module").then(
        (m) => m.LandingPageModule
      ),
  },
  {
    path: "Wallet",
    loadChildren: () =>
      import("./gems-wallet/gems-wallet.module").then(
        (m) => m.GemsWalletModule
      ),
  },
  {
    path: "Backend",
    loadChildren: () =>
      import("./renewal-notification/renewal-notification.module").then(
        (m) => m.RenewalNotificationModule
      ),
  },

  {
    path: "offline-booking",
    loadChildren: () =>
      import("./offline-booking/offline-booking.module").then(
        (m) => m.OfflineBookingModule
      ),
  },

  {
    path: "data-management/manage-sub-class",
    component: ManageSubClassMissingMakeModelComponent,
  },
  { path: "data-management/broker", component: BrokerComponent },
  { path: "data-management/add-broker", component: AddBrokerComponent },
  { path: "data-management/edit-broker/:Id", component: EditBrokerComponent },

  { path: "data-management/lob", component: LobComponent },
  { path: "data-management/add-lob", component: AddLobComponent },
  { path: "data-management/edit-lob/:Id", component: EditLobComponent },

  { path: "data-management/segment", component: SegmentComponent },
  { path: "data-management/add-segment", component: AddSegmentComponent },
  { path: "data-management/edit-segment/:Id", component: EditSegmentComponent },

  { path: "data-management/class", component: ClassComponent },
  { path: "data-management/add-class", component: AddClassComponent },
  { path: "data-management/edit-class/:Id", component: EditClassComponent },

  { path: "data-management/products", component: ProductComponent },
  { path: "data-management/add-products", component: AddProductComponent },
  {
    path: "data-management/edit-products/:Id",
    component: EditProductComponent,
  },

  { path: "data-management/sub-products", component: SubProductComponent },
  {
    path: "data-management/add-sub-products",
    component: AddSubProductComponent,
  },
  {
    path: "data-management/edit-sub-products/:Id",
    component: EditSubProductComponent,
  },

  {
    path: "data-management/insurance-companies",
    component: InsCompaniesComponent,
  },
  {
    path: "data-management/add-insurance-companies",
    component: AddInsCompanyComponent,
  },
  {
    path: "data-management/edit-insurance-companies/:Id",
    component: EditInsCompanyComponent,
  },

  {
    path: "data-management/insurance-companies-branches",
    component: SubInsCompaniesComponent,
  },
  {
    path: "data-management/add-insurance-companies-branches",
    component: AddSubInsCompaniesComponent,
  },
  {
    path: "data-management/edit-insurance-companies-branches/:Id",
    component: EditSubInsCompaniesComponent,
  },

  { path: "data-management/rto", component: RtoComponent },
  { path: "data-management/add-rto", component: AddRtoComponent },
  { path: "data-management/edit-rto/:Id", component: EditRtoComponent },

  {
    path: "data-management/payment-towards",
    component: PaymentTowardsComponent,
  },
  {
    path: "data-management/add-payment-towards",
    component: AddPaymentTowardsComponent,
  },
  {
    path: "data-management/edit-payment-towards/:Id",
    component: EditPaymentTowardsComponent,
  },

  { path: "data-management/vehicle", component: VehicleComponent },
  {
    path: "data-management/vehicle/add-vehicle",
    component: AddVehicleComponent,
  },
  {
    path: "data-management/vehicle/edit-vehicle/:Id",
    component: EditVehicleComponent,
  },

  {
    path: "projection-target",
    loadChildren: () =>
      import("./projection-target/projection-target.module").then(
        (m) => m.ProjectionTargetModule
      ),
  },
  {
    path: "pos-directory",
    loadChildren: () =>
      import("./pos-directory/pos-directory.module").then(
        (m) => m.PosDirectoryModule
      ),
  },

  {
    path: "offline-booking",
    loadChildren: () =>
      import("./offline-booking/offline-booking.module").then(
        (m) => m.OfflineBookingModule
      ),
  },

  {
    path: "claim",
    loadChildren: () =>
      import("./claim/claim.module").then((m) => m.ClaimModule),
  },

  {
    path: "dsr",
    loadChildren: () =>
      import("./dsr-module/dsr-module.module").then((m) => m.DsrModuleModule),
  },

  {
    path: "sales-brokerage",
    loadChildren: () =>
      import("./sales-brokerage/sales-brokerage.module").then(
        (m) => m.SalesBrokerageModule
      ),
  },

  {
    path: "business-master",
    loadChildren: () =>
      import("./business-master/business-master.module").then(
        (m) => m.BusinessMasterModule
      ),
  },
  {
    path: "insurer-emp",
    loadChildren: () =>
      import("./insurer-emp/insurer-emp.module").then(
        (m) => m.InsurerEmpModule
      ),
  },

  {
    path: "event",
    loadChildren: () =>
      import("./event-calendar/event-calendar.module").then(
        (m) => m.EventCalendarModule
      ),
  },

  {
    path: "bulk-mail",
    loadChildren: () =>
      import("./bulk-mail-sender/bulk-mail-sender.module").then(
        (m) => m.BulkMailSenderModule
      ),
  },

  {
    path: "payout",
    loadChildren: () =>
      import("./payout-mode-request/payout-mode-request.module").then(
        (m) => m.PayoutModeRequestModule
      ),
  },
  {
    path: "tds",
    loadChildren: () =>
      import("./tdscertificate/tdscertificate.module").then(
        (m) => m.TDSCertificateModule
      ),
  },
  // new
  {
    path: "epartner",
    loadChildren: () =>
      import("./e-parner-quotations/e-parner-quotations.module").then(
        (m) => m.EParnerQuotationsModule
      ),
  },
  {
    path: "event-gallery",
    loadChildren: () =>
      import("./event-gallery/event-gallery.module").then(
        (m) => m.EventGalleryModule
      ),
  },
  {
    path: "lwp-projection-report",
    loadChildren: () =>
      import("./lwp-projection-report/lwp-projection-report.module").then(
        (m) => m.LwpProjectionReportModule
      ),
  },
  {
    path: "travel_request",
    loadChildren: () =>
      import("./travel-management/travel-management.module").then(
        (m) => m.TravelManagementModule
      ),
  },
  {
    path: "claim-assistance",
    loadChildren: () =>
      import("./claim/claim.module").then((m) => m.ClaimModule),
  },
  {
    path: "hrms",
    loadChildren: () => import("./hrms/hrms.module").then((m) => m.HrmsModule),
  },
  {
    path: "CompanyPages",
    loadChildren: () =>
      import("./website-page/website-page.module").then(
        (m) => m.WebsitePageModule
      ),
  },
  {
    path: "partner",
    loadChildren: () =>
      import("./partner/partner.module").then((m) => m.PartnerModule),
  },
  {
    path: "product_mapping",
    loadChildren: () =>
      import("./product-mapping/product-mapping.module").then(
        (m) => m.ProductMappingModule
      ),
  },
  {
    path: "Sync",
    loadChildren: () =>
      import("./sync-leads/sync-leads.module").then((m) => m.SyncLeadsModule),
  },
  {
    path: "integration",
    loadChildren: () =>
      import(
        "./website-product-integration/website-product-integration.module"
      ).then((m) => m.WebsiteProductIntegrationModule),
  },
  {
    path: "ehrms",
    loadChildren: () =>
      import("./ehrms/ehrms.module").then((m) => m.EhrmsModule),
  },
  {
    path: "vendor_management",
    loadChildren: () =>
      import("./vendor-management/vendor-management.module").then(
        (m) => m.VendorManagementModule
      ),
  },
  {
    path: "cashless-garage",
    loadChildren: () =>
      import("./cashlessgarage/cashlessgarage.module").then(
        (m) => m.CashlessgarageModule
      ),
  },
  {
    path: "data_dictionary",
    loadChildren: () =>
      import("./data-dictionary/data-dictionary.module").then(
        (m) => m.DataDictionaryModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
// Website-section/View-posters
