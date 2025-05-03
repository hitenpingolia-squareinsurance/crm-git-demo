import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { PayoutModeRequestRoutingModule } from './payout-mode-request-routing.module';
import { PayoutReportComponent } from './payout-report/payout-report.component';
import { AddPayoutReportComponent } from './add-payout-report/add-payout-report.component';
import { PayoutDetailComponent } from './payout-detail/payout-detail.component';
import { ViewMoreComponent } from './view-more/view-more.component';


@NgModule({
  declarations: [PayoutReportComponent, AddPayoutReportComponent, PayoutDetailComponent, ViewMoreComponent],
  imports: [
    CommonModule,
    BsDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatDialogModule,
    NgMultiSelectDropDownModule,
    PayoutModeRequestRoutingModule,
    
  ],

  entryComponents: [
    AddPayoutReportComponent,
    PayoutDetailComponent,
    ViewMoreComponent,
  ]
})
export class PayoutModeRequestModule { }
