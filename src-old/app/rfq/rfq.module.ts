import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { MatListModule } from '@angular/material/list';

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { SharedModule } from "../shared/shared.module";

import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { RFQRoutingModule } from "./rfq-routing.module";
import { FireFormComponent } from "./fire-form/fire-form.component";
import { MatTabsModule } from "@angular/material/tabs";
import { RfqFormCoverageComponent } from "./rfq-form-coverage/rfq-form-coverage.component";
import { FireFormsComponent } from "./fire-forms/fire-forms.component";
import { RfqGeneratListComponent } from './rfq-generat-list/rfq-generat-list.component';
import { RfqViewModelComponent } from './rfq-view-model/rfq-view-model.component';
import { RfqQuoteDetailsComponent } from './rfq-quote-details/rfq-quote-details.component';
import { RejectquoteComponent } from './rejectquote/rejectquote.component';
import { ManageRequestsComponent } from './manage-requests/manage-requests.component';
import { RfqCardsComponent } from './rfq-cards/rfq-cards.component';

@NgModule({


  imports: [CommonModule,BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    DataTablesModule,
    RFQRoutingModule, 
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    SharedModule,
    MatTabsModule
    
    
  ],

  declarations: [
    FireFormComponent,
    RfqFormCoverageComponent,
    FireFormsComponent, 
    RfqGeneratListComponent, 
    RfqViewModelComponent, RfqQuoteDetailsComponent, RejectquoteComponent, ManageRequestsComponent, RfqCardsComponent
  ],

  entryComponents: [RejectquoteComponent]

})
export class RFQModule {}
