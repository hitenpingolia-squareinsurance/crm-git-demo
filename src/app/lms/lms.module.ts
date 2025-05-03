import { CKEditorModule } from 'ckeditor4-angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { LMSRoutingModule } from './lms-routing.module';
import { AddLeadsComponent } from './add-leads/add-leads.component';
import { ViewLeadsComponent } from './view-leads/view-leads.component';
import { LeadsDetailsComponent } from './leads-details/leads-details.component';


@NgModule({
  declarations: [AddLeadsComponent, ViewLeadsComponent, LeadsDetailsComponent],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,DataTablesModule,MatDialogModule,NgMultiSelectDropDownModule,BsDatepickerModule,
    LMSRoutingModule
  ],
  entryComponents: [AddLeadsComponent,LeadsDetailsComponent],

})
export class LMSModule { }
