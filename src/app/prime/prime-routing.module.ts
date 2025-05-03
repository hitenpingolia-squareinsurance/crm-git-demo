import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerequestsComponent } from './managerequests/managerequests.component';

const routes: Routes = [

  { path : 'Manage-Request', component : ManagerequestsComponent}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrimeRoutingModule { } 
