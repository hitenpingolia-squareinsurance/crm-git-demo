import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { ExamsRoutingModule } from './exams-routing.module';
import { QuestionAnswerMasterComponent } from './question-answer-master/question-answer-master.component';
import { AddquestionsComponent } from './addquestions/addquestions.component';
import { ExamreportComponent } from './examreport/examreport.component';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [QuestionAnswerMasterComponent, AddquestionsComponent, ExamreportComponent],
  imports: [
    CommonModule,SharedModule,
    ExamsRoutingModule,FormsModule,ReactiveFormsModule,DataTablesModule,NgMultiSelectDropDownModule,MatDialogModule
  ]
})
export class ExamsModule { }
