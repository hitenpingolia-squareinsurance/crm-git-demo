import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaimRoutingModule } from './claim-routing.module';
import { ViewRequestComponent } from './view-request/view-request.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { MatDialogModule } from "@angular/material/dialog";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ViewPopupComponent } from './view-popup/view-popup.component';
import { ClaimDetailsComponent } from './claim-details/claim-details.component';
import { StatusBoxComponent } from './status-box/status-box.component';

import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [ViewRequestComponent, ViewPopupComponent, ClaimDetailsComponent, StatusBoxComponent],
  
  imports: [
    CommonModule,
    ClaimRoutingModule,FormsModule,ReactiveFormsModule,DataTablesModule,MatDialogModule,NgMultiSelectDropDownModule,BsDatepickerModule,SharedModule
    
  ],
  entryComponents: [ViewPopupComponent,StatusBoxComponent]
})
export class ClaimModule { }
