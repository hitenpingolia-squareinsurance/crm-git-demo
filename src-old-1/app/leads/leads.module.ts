import { ViewFollowUpsComponent } from './view-follow-ups/view-follow-ups.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { LeadsRoutingModule } from './leads-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ContactUsQueryComponent } from './contact-us-query/contact-us-query.component';
import { ScheduleCallBackComponent } from './schedule-call-back/schedule-call-back.component';
import { CorporateInsuranceComponent } from './corporate-insurance/corporate-insurance.component';
import { SharedModule } from "../shared/shared.module";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [ContactUsQueryComponent, ScheduleCallBackComponent, CorporateInsuranceComponent],
  imports: [
    CommonModule,
    LeadsRoutingModule,
    FormsModule, ReactiveFormsModule, MatDialogModule,
    DataTablesModule, FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    BsDatepickerModule,
    NgMultiSelectDropDownModule,
    MatDialogModule,
    SharedModule
  ]
})
export class LeadsModule { }
