import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
 import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
 import { CKEditorModule } from 'ckeditor4-angular';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { KnowledgeBaseRoutingModule } from './knowledge-base-routing.module';
import { AddKnowledgeComponent } from './add-knowledge/add-knowledge.component';
import { ViewKnowledgeBaseComponent } from './view-knowledge-base/view-knowledge-base.component';
import { ViewKnowledgeDetailsComponent } from './view-knowledge-details/view-knowledge-details.component';
import { ViewSingleContentComponent } from './view-single-content/view-single-content.component';


@NgModule({
  declarations: [AddKnowledgeComponent, ViewKnowledgeBaseComponent, ViewKnowledgeDetailsComponent, ViewSingleContentComponent],
  imports: [
    CommonModule,MatDialogModule,FormsModule,ReactiveFormsModule,DataTablesModule,NgMultiSelectDropDownModule,BsDatepickerModule,
    KnowledgeBaseRoutingModule,CKEditorModule
  ]
})
export class KnowledgeBaseModule { }
