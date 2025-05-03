import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from "../shared/shared.module";

import { MastertableComponent } from './mastertable/mastertable.component';
import { MasterdataComponent } from './masterdata/masterdata.component';

import { HelpdeskRoutingModule } from './helpdesk-routing.module';
import { MotorReportsComponent } from './motor-reports/motor-reports.component';
import { MotorQuoteDetailsComponent } from './motor-quote-details/motor-quote-details.component';


@NgModule({
  declarations: [MotorReportsComponent,MastertableComponent,MasterdataComponent, MotorQuoteDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule,
    MatDialogModule,
    SharedModule,

    HelpdeskRoutingModule
  ]
})
export class HelpdeskModule { }
