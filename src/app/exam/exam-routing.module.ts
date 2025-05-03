import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamstartComponent } from './examstart/examstart.component';


const routes: Routes = [
  {path: 'agent/exam', component: ExamstartComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }
 