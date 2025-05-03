import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamRoutingModule } from './exam-routing.module';
import { ExamstartComponent } from './examstart/examstart.component';


@NgModule({
  declarations: [ExamstartComponent],
  imports: [
    CommonModule,
    ExamRoutingModule
  ]
})
export class ExamModule { }
