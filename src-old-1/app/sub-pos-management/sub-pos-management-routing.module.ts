import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatesubposComponent } from './createsubpos/createsubpos.component';
import { ViewManageRequestComponent } from './view-manage-request/view-manage-request.component';


const routes: Routes = [

  {path: 'Create-Sub-Pos', component: CreatesubposComponent},
  {path: 'view-manage-request', component: ViewManageRequestComponent},
  {path: 'view-manage-request-manager', component: ViewManageRequestComponent},

];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubPosManagementRoutingModule { }
 