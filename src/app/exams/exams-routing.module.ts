import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionAnswerMasterComponent } from './question-answer-master/question-answer-master.component';
import { AddquestionsComponent } from './addquestions/addquestions.component';
import { ExamreportComponent } from './examreport/examreport.component';

const routes: Routes = [
  { path: 'Add_question', component: AddquestionsComponent },
  { path: 'question-answer', component: QuestionAnswerMasterComponent },
  { path: 'exam-reports', component: ExamreportComponent },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamsRoutingModule { }
