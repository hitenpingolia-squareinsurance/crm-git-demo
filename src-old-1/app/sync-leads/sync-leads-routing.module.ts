import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { RangeMasterComponent } from './range-master/range-master.component';
import { LeadsComponent } from './leads/leads.component';

const routes: Routes = [

  {path: 'range_master', component:RangeMasterComponent},
  {path: 'leads', component:LeadsComponent},
  {path: 'purchased-leads', component:LeadsComponent},
  {path: 'purchased-leads/:ID', component:LeadsComponent},
  {path: 'user-transaction', component:LeadsComponent},
  {path: 'synced-report', component:AdminPanelComponent},
  {path: 'synced-leads', component:AdminPanelComponent},
  {path: 'synced-contact', component:AdminPanelComponent},
  {path: 'synced-users', component:AdminPanelComponent},
  {path: 'synced-details/:ID', component:AdminPanelComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SyncLeadsRoutingModule { }
