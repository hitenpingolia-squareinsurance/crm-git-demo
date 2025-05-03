import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailTemplateRoutingModule } from './mail-template-routing.module';
import { MailTemplateComponent } from './mail-template/mail-template.component';
import { ViewTemplateComponent } from './view-template/view-template.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CKEditorModule } from 'ckeditor4-angular';


@NgModule({
  declarations: [MailTemplateComponent, ViewTemplateComponent],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,DataTablesModule,MatDialogModule,NgMultiSelectDropDownModule,CKEditorModule,
    MailTemplateRoutingModule
  ]
})
export class MailTemplateModule { }
