import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FromComponent } from './from/from.component';

const routes: Routes = [
  {path:'form', component: FromComponent},
  {path:'ip', component: FromComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IpBlockRoutingModule { }
