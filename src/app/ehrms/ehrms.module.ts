import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { SharedModule } from "../shared/shared.module";
import { MatDialogModule } from '@angular/material/dialog';

import { EhrmsRoutingModule } from './ehrms-routing.module';
import { LocalMiscellaneousClaimComponent } from './local-miscellaneous-claim/local-miscellaneous-claim.component';
import { LocalMiscellaneousDetailsComponent } from './local-miscellaneous-details/local-miscellaneous-details.component';


@NgModule({
  declarations: [LocalMiscellaneousClaimComponent, LocalMiscellaneousDetailsComponent],
  imports: [
      CommonModule,
       FormsModule,
       ReactiveFormsModule,
       DataTablesModule,
       SharedModule,
       MatDialogModule,
       BsDatepickerModule,
       NgMultiSelectDropDownModule.forRoot(),
      EhrmsRoutingModule
  ],
    entryComponents : [LocalMiscellaneousDetailsComponent]
})
export class EhrmsModule { }
