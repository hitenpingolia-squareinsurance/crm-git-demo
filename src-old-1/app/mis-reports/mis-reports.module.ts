import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule, MatCommonModule,  MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { MisReportsRoutingModule } from './mis-reports-routing.module';
import { SharedModule } from "../shared/shared.module";

import { BusinessComponent } from './business/business.component';
import { OfflineQuoteComponent } from './offline-quote/offline-quote.component';
import { TicketComponent } from './ticket/ticket.component';
import { EndorsementComponent } from './endorsement/endorsement.component';
import { PosComponent } from './pos/pos.component';
import { RenewalComponent } from './renewal/renewal.component';
import { RecoveryComponent } from './recovery/recovery.component';

import { PrimerejectdetailspopupComponent } from '../modals/primerejectdetailspopup/primerejectdetailspopup.component';
// import { AddprimerequestpopupComponent } from '../modals/addprimerequestpopup/addprimerequestpopup.component';
import { GemsDetailsViewRemarkComponent } from '../modals/gems-details-view-remark/gems-details-view-remark.component';
 
import { PosActiveInactiveComponent } from './pos-active-inactive/pos-active-inactive.component';
import { GemsreportsComponent } from './gemsreports/gemsreports.component';
import { CashReportComponent } from './cash-report/cash-report.component';
import { BusniessReportComponent } from './Reports/busniess-report/busniess-report.component';

import {EligibleComponentComponent} from './eligible-component/eligible-component.component';

@NgModule({
  declarations: [
    BusinessComponent,
    OfflineQuoteComponent,
    TicketComponent,
    EndorsementComponent,
    PosComponent,
    RenewalComponent,
    RecoveryComponent,PrimerejectdetailspopupComponent,GemsDetailsViewRemarkComponent, 
     PosActiveInactiveComponent,
     GemsreportsComponent,CashReportComponent, BusniessReportComponent,EligibleComponentComponent
  ],

  imports: [
    CommonModule,
    MisReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    DataTablesModule,
    BsDatepickerModule,MatDialogModule,MatInputModule,MatFormFieldModule,MatCommonModule,MatButtonModule,
    SharedModule
  ],

  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [PrimerejectdetailspopupComponent,GemsDetailsViewRemarkComponent,EligibleComponentComponent],

})

export class MisReportsModule { }
