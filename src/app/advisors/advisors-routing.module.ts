import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyAdvisorsComponent} from './my-advisors/my-advisors.component';
import { RemoveAdvisorComponent } from './remove-advisor/remove-advisor.component';
import { ViewTeleLeadsComponent } from './view-tele-leads/view-tele-leads.component';

const routes: Routes = [
  { path: "add-advisors", component: MyAdvisorsComponent },
  { path: "remove-advisors", component: RemoveAdvisorComponent },
  { path: "view-leads", component: ViewTeleLeadsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdvisorsRoutingModule { }
