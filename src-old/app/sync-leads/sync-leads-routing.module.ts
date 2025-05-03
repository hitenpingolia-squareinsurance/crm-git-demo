import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewPlansComponent } from './view-plans/view-plans.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { RangeMasterComponent } from './range-master/range-master.component';

const routes: Routes = [
  {path: 'plans', component:ViewPlansComponent},
  {path: 'agent_plans', component:ViewPlansComponent},
  // {path: 'admin', component:AdminPanelComponent},
  {path: 'users', component:AdminPanelComponent},
  // {path: 'users/:Id', component:AdminPanelComponent},
  {path: 'leads/:Id', component:AdminPanelComponent},
  {path: 'AllLeads', component:AdminPanelComponent},

  {path: 'range_master', component:RangeMasterComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SyncLeadsRoutingModule { }
