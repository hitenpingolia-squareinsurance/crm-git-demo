import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewNocComponent } from './view-noc/view-noc.component';


const routes: Routes = [

  { path: 'view-noc', component: ViewNocComponent },
  { path: 'Action-noc-hod', component: ViewNocComponent },
  { path: 'Action-noc-Accounts', component: ViewNocComponent },
  { path: 'Action-noc-Principal', component: ViewNocComponent },
  { path: 'Action-noc-Pos', component: ViewNocComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NOCRoutingModule { }
