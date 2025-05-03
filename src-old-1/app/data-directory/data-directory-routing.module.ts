import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewDataComponent } from './view-data/view-data.component';


const routes: Routes = [
  { path:'view-data',component:ViewDataComponent},
  // { path:'manage-requests',component:ViewLeadsComponent},  data-directory/view-data
 
 ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataDirectoryRoutingModule { }
