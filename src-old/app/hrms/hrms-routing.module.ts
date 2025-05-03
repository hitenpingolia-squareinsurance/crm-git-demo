import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamInoutComponent } from './team-inout/team-inout.component';

const routes: Routes = [
  { path: 'leaves', loadChildren: () => import('./leaves/leaves.module').then(m => m.LeavesModule) },
  { path: "team-inout", component: TeamInoutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmsRoutingModule { }
