import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog'
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { SyncLeadsRoutingModule } from './sync-leads-routing.module';
import { ViewPlansComponent } from './view-plans/view-plans.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { RangeMasterComponent } from './range-master/range-master.component';

@NgModule({
  declarations: [ ViewPlansComponent, AdminPanelComponent, RangeMasterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    DataTablesModule,
    MatDialogModule,
    SyncLeadsRoutingModule,
    BsDatepickerModule
  ]
})
export class SyncLeadsModule { }
