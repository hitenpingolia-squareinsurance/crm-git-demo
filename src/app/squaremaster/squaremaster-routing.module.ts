import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MastertableComponent } from './mastertable/mastertable.component';
import { MasterdataComponent } from './masterdata/masterdata.component';



const routes: Routes = [
  {path: 'Mastertable', component: MastertableComponent},
  {path: 'Masterdata', component: MasterdataComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SquaremasterRoutingModule { }
