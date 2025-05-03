import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { MatTabsModule } from "@angular/material/tabs";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatDividerModule } from "@angular/material/divider";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { SharedModule } from "../shared/shared.module";

import { MyaccountRoutingModule } from "./myaccount-routing.module";
import { AccountComponent } from "./account/account.component";
import { QuotationComponent } from "./quotation/quotation.component";
import { PolicyComponent } from "./policy/policy.component";
import { InspectionComponent } from "./inspection/inspection.component";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { RenewalComponent } from "./renewal/renewal.component";
import { InspectiondetailsdailogComponent } from "../modals/inspectiondetailsdailog/inspectiondetailsdailog.component";

import { OfflineQuoteComponent } from "./OfflineQuote/offline-quote/offline-quote.component";
import { ViewOfflineQuoteComponent } from "./OfflineQuote/view-offline-quote/view-offline-quote.component";
import { OfflineQuoteDetailsComponent } from "./OfflineQuote/offline-quote-details/offline-quote-details.component";
import { ManageQuoteComponent } from "./OfflineQuote/manage-quote/manage-quote.component";
import { MyearningComponent } from "./myearning/myearning.component";
import { StatementsComponent } from "./statements/statements.component";
import { RenewalfollowformComponent } from "./renewalfollowform/renewalfollowform.component";
import { RenewalfollowdetailsComponent } from "./renewalfollowdetails/renewalfollowdetails.component";
import { RenewalmanagerComponent } from "./renewalmanager/renewalmanager.component";
import { EmailsendpopupsComponent } from "./emailsendpopups/emailsendpopups.component";
import { ViewPoPolicesComponent } from "../modals/view-po-polices/view-po-polices.component";
import { RejectquoteComponent } from "./OfflineQuote/rejectquote/rejectquote.component";
import { EmployeerenewalpopupComponent } from "./employeerenewalpopup/employeerenewalpopup.component";
import { RenewalSectionComponent } from "./renewal-section/renewal-section.component";

import { RenewalfollowformwithagetgroupComponent } from "./renewalfollowformwithagetgroup/renewalfollowformwithagetgroup.component";
import { ManegerRenewalSectionComponent } from "./maneger-renewal-section/maneger-renewal-section.component";
import { AgentRenewalDetailsComponent } from "./agent-renewal-details/agent-renewal-details.component";
import { LostRenewalManagerComponent } from "./lost-renewal-manager/lost-renewal-manager.component";

import { ManageOfflineQuoteComponent } from "./OfflineHealthQuote/manage-offline-quote/manage-offline-quote.component";
import { OfflineHealthDetailsComponent } from "./OfflineHealthQuote/offline-health-details/offline-health-details.component";
import { OfflineHealthRejectComponent } from "./OfflineHealthQuote/offline-health-reject/offline-health-reject.component";
import { ViewHealtQuoteComponent } from "./OfflineHealthQuote/view-healt-quote/view-healt-quote.component";
import { LostRenewalManagerOldComponent } from "./lost-renewal-manager-old/lost-renewal-manager-old.component";
import { StatementSingleComponent } from "./statement-single/statement-single.component";
import { LostRenewalCasesComponent } from './lost-renewal-cases/lost-renewal-cases.component';
@NgModule({
  declarations: [
    AccountComponent,
    QuotationComponent,
    RenewalComponent,
    PolicyComponent,
    InspectionComponent,
    OfflineQuoteComponent,
    ViewOfflineQuoteComponent,
    OfflineQuoteDetailsComponent,
    ManageQuoteComponent,
    MyearningComponent,
    StatementsComponent,
    RenewalfollowformComponent,
    RenewalfollowdetailsComponent,
    RenewalmanagerComponent,
    ViewPoPolicesComponent,
    InspectiondetailsdailogComponent,
    EmailsendpopupsComponent,
    RejectquoteComponent,
    EmployeerenewalpopupComponent,
    RenewalSectionComponent,
    RenewalfollowformwithagetgroupComponent,
    ManegerRenewalSectionComponent,
    AgentRenewalDetailsComponent,
    LostRenewalManagerComponent,
    ManageOfflineQuoteComponent,
    OfflineHealthDetailsComponent,
    OfflineHealthRejectComponent,
    ViewHealtQuoteComponent,
    LostRenewalManagerOldComponent,
    StatementSingleComponent,
    LostRenewalCasesComponent,
  ],
  imports: [
    CommonModule,
    MyaccountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    BsDatepickerModule,
    NgMultiSelectDropDownModule,
    MatDialogModule,
    SharedModule,
    ScrollingModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
    ScrollingModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ],

  entryComponents: [
    InspectiondetailsdailogComponent,
    RenewalfollowformComponent,
    RenewalfollowdetailsComponent,
    EmailsendpopupsComponent,
    RejectquoteComponent,
    ViewPoPolicesComponent,
    EmployeerenewalpopupComponent,
    RenewalfollowformwithagetgroupComponent,
    AgentRenewalDetailsComponent,
    OfflineHealthRejectComponent,
    StatementSingleComponent,
    LostRenewalCasesComponent,
  ],
})
export class MyaccountModule {
  constructor() {
    // console.log('MyaccountModule');
  }
}
