import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlCasesOnlineComponent } from './control-cases-online/control-cases-online.component';


const routes: Routes = [

  {path: 'online', component: ControlCasesOnlineComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlCasesRoutingModule { }
