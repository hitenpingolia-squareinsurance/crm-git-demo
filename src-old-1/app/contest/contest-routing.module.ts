import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewContestComponent } from './view-contest/view-contest.component';

const routes: Routes = [
  {path:'contest-view', component: ViewContestComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContestRoutingModule { }
