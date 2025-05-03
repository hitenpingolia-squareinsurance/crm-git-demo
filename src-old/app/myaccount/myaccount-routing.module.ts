import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AccountComponent } from "./account/account.component";
import { QuotationComponent } from "./quotation/quotation.component";
import { PolicyComponent } from "./policy/policy.component";
import { InspectionComponent } from "./inspection/inspection.component";

import { RenewalComponent } from "./renewal/renewal.component";
import { OfflineQuoteComponent } from "./OfflineQuote/offline-quote/offline-quote.component";
import { ViewOfflineQuoteComponent } from "./OfflineQuote/view-offline-quote/view-offline-quote.component";
import { OfflineQuoteDetailsComponent } from "./OfflineQuote/offline-quote-details/offline-quote-details.component";

import { ManageQuoteComponent } from "./OfflineQuote/manage-quote/manage-quote.component";

import { MyearningComponent } from "./myearning/myearning.component";
import { StatementsComponent } from "./statements/statements.component";

import { RenewalmanagerComponent } from "./renewalmanager/renewalmanager.component";
import { RenewalSectionComponent } from "./renewal-section/renewal-section.component";
import { ManegerRenewalSectionComponent } from './maneger-renewal-section/maneger-renewal-section.component';
import { LostRenewalManagerComponent } from "./lost-renewal-manager/lost-renewal-manager.component";
import { ViewHealtQuoteComponent } from "./OfflineHealthQuote/view-healt-quote/view-healt-quote.component";
import { OfflineHealthDetailsComponent } from "./OfflineHealthQuote/offline-health-details/offline-health-details.component";
import { LostRenewalManagerOldComponent } from "./lost-renewal-manager-old/lost-renewal-manager-old.component";
import { ManageOfflineQuoteComponent } from "./OfflineHealthQuote/manage-offline-quote/manage-offline-quote.component";

const routes: Routes = [
  // {path: 'account/cases/renewals', component: RenewalComponent},
  // {path: 'account/cases/quotations', component: QuotationComponent},
  // {path: 'account/cases/policies', component: PolicyComponent},
  // {path: 'account/cases/inspections', component: InspectionComponent},
  // {path: 'offline-quote/create-requests', component: OfflineQuoteComponent},
  // {path: 'offline-quote/view-requests', component: ViewOfflineQuoteComponent},
  // {path: 'offline-quote/view-Details-quote/:Quotation', component: OfflineQuoteDetailsComponent},
  // {path: 'manage-requests/offline-quote', component: ManageQuoteComponent},
  // {path: 'manage-requests/view-offline-quote/:Quotation', component: OfflineQuoteDetailsComponent},
  // {path: 'account/MyEarning', component: MyearningComponent},
  // {path: 'account/Statements', component: StatementsComponent},
  
  { path: "cases/renewals-section", component: RenewalSectionComponent },
  // { path: "cases/maneger-renewals-section", component: ManegerRenewalSectionComponent },
  { path: "cases/renewals", component: RenewalComponent },
  { path: "cases/renewals-reports", component: RenewalComponent },
  { path: "cases/quotations", component: QuotationComponent },
  { path: "cases/policies", component: PolicyComponent },
  { path: "cases/inspections", component: InspectionComponent },
  { path: "MyEarning", component: MyearningComponent },
  { path: "Statements", component: StatementsComponent },

  { path: "create-requests", component: OfflineQuoteComponent },
  { path: "view-requests", component: ViewOfflineQuoteComponent },
  { path: "view-punching-team", component: ViewOfflineQuoteComponent },
  { path: "view-Account-team", component: ViewOfflineQuoteComponent },
  {
    path: "view-Details-quote/:Quotation",
    component: OfflineQuoteDetailsComponent,
  },
  {
    path: "view-punching-team/:Quotation",
    component: OfflineQuoteDetailsComponent,
  },

  { path: "offline-quote", component: ManageQuoteComponent },
  {
    path: "view-offline-quote/:Quotation",
    component: OfflineQuoteDetailsComponent,
  },
  {
    path: "renewal/manage-renewal-request",
    component: ManegerRenewalSectionComponent,
  },
  {
    path: "renewal/manage-renewal-lost-request",
    component: LostRenewalManagerComponent,
  },
  {
    path: "renewal/manage-renewal-lost-request/old",
    component: LostRenewalManagerOldComponent,
  },

  { path: "view-health-requests", component: ViewHealtQuoteComponent,},
  { path: "view-health-manage-requests", component: ManageOfflineQuoteComponent,},
  { path: "view-health-punching-team", component: ViewHealtQuoteComponent,},
  { path: "view-health-Account-team", component: ViewHealtQuoteComponent,},
  
  { path: "view-health-offline-quote/:Quotation", component: OfflineHealthDetailsComponent,},
  { path: "view-health-Details-quote/:Quotation", component: OfflineHealthDetailsComponent,},
  { path: "view-health-punching-team/:Quotation", component: OfflineHealthDetailsComponent,},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyaccountRoutingModule { }
