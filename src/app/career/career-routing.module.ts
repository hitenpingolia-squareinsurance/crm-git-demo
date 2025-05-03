import { ViewRecruitmentRequestComponent } from './recruitment-request/view-recruitment-request/view-recruitment-request.component';
import { ViewCurrentOpeningComponent } from './current-opening/view-current-opening/view-current-opening.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'Current-Opening', component: ViewCurrentOpeningComponent },
  { path: 'Recruitment-Request', component: ViewRecruitmentRequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareerRoutingModule { }
