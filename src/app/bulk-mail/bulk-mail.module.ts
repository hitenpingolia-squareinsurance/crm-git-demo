import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BulkMailRoutingModule } from './bulk-mail-routing.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { TeamMailComponent } from './team-mail/team-mail.component';



@NgModule({
  declarations: [TeamMailComponent],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,DataTablesModule,MatDialogModule,NgMultiSelectDropDownModule,CKEditorModule,
    BulkMailRoutingModule
  ]
})
export class BulkMailModule { }
