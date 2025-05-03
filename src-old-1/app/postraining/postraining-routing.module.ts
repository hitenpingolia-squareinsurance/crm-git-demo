import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  StarterPageComponent } from './starter-page/starter-page.component';
import {  TrainingRuningComponent } from './training-runing/training-runing.component';
import {  ExamstartpageComponent } from './examstartpage/examstartpage.component';
import {  ExamResultComponent } from './exam-result/exam-result.component';

const routes: Routes = [

  {path: 'Training-Start', component: StarterPageComponent},
  {path: 'Training/:Type', component: TrainingRuningComponent},
  {path: 'ExamStart/:Type', component: ExamstartpageComponent},
  {path: 'ExamResult/:Type', component: ExamResultComponent}

 
     

];
 
@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostrainingRoutingModule { } 
  