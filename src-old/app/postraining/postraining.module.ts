import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule  } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { PostrainingRoutingModule } from './postraining-routing.module';
import { StarterPageComponent } from './starter-page/starter-page.component';
import { TrainingRuningComponent } from './training-runing/training-runing.component';
import { ExamstartpageComponent } from './examstartpage/examstartpage.component';
import { ExamResultComponent } from './exam-result/exam-result.component';
import { PopupexamconfirmComponent } from './popupexamconfirm/popupexamconfirm.component';

 
@NgModule({
  declarations: [StarterPageComponent, TrainingRuningComponent, ExamstartpageComponent, ExamResultComponent, PopupexamconfirmComponent],
  imports: [
    CommonModule,
    PostrainingRoutingModule,
    FormsModule,
    MatDialogModule
  ],
  entryComponents: [PopupexamconfirmComponent]
})
export class PostrainingModule { }
 