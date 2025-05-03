import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FireFormComponent } from "./fire-form/fire-form.component";
import { RfqFormCoverageComponent } from "./rfq-form-coverage/rfq-form-coverage.component";
import { FireFormsComponent } from "./fire-forms/fire-forms.component";
import { RfqGeneratListComponent } from "./rfq-generat-list/rfq-generat-list.component";
import { RfqViewModelComponent } from "./rfq-view-model/rfq-view-model.component";
import { RfqQuoteDetailsComponent } from './rfq-quote-details/rfq-quote-details.component';
import { ManageRequestsComponent } from "./manage-requests/manage-requests.component";
import { RfqCardsComponent } from "./rfq-cards/rfq-cards.component";

const routes: Routes = [
  { path: "Fire-Form/:quotation_id", component: FireFormComponent },
  // { path: "Fire-Form", component: FireFormComponent },
  { path: "Edit-Fire-Form/:quotation_id", component: FireFormComponent },
  { path: "Add-Covrage-Form", component: RfqFormCoverageComponent },
  // { path: "otc-Fire-Form", component: FireFormsComponent },
  { path: "otc-Fire-Form/:Id", component: FireFormsComponent },


  { path: "products", component: RfqCardsComponent },
  // { path: "view-fire-list", component: RfqGeneratListComponent },

  { path: "view-requests", component: RfqGeneratListComponent },
  { path: "view-punching-team", component: RfqGeneratListComponent },
  { path: "view-Account-team", component: RfqGeneratListComponent },
  { path: "offline-manage-requests", component: ManageRequestsComponent },
    
  { path: "rfq-view-model/:quotation_id", component: RfqViewModelComponent },
  { path: "view-offline-quote/:Quotation", component: RfqQuoteDetailsComponent, },
  { path: "view-Details-quote/:Quotation", component: RfqQuoteDetailsComponent, },
  { path: "view-punching-team/:Quotation", component: RfqQuoteDetailsComponent, },
  { path: "view-offline-quote/:Quotation", component: RfqQuoteDetailsComponent,},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RFQRoutingModule {}
