import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRequestComponent } from './create-request/create-request.component';
import { ViewRequestComponent } from './view-request/view-request.component';
const routes: Routes = [
  {path:'add_request', component: CreateRequestComponent},
  {path:'view_request', component: ViewRequestComponent},
  {path:'manager_request', component: ViewRequestComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingRequestRoutingModule { }
