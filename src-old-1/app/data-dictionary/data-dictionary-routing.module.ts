import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewDataLeadComponent } from './view-data-lead/view-data-lead.component';
import { ViewDataListComponent } from './view-data-list/view-data-list.component';

const routes: Routes = [
  {path : 'view-data-lead', component:ViewDataLeadComponent},
  {path : 'view-data-list/:id', component:ViewDataListComponent},
  {path : 'assign-data-list', component:ViewDataListComponent},
  {path : 'user-data-list', component:ViewDataListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataDictionaryRoutingModule { }
