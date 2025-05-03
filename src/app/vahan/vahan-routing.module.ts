import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VahansComponent } from './vahans/vahans.component';

const routes: Routes = [
  { path: 'vahans', component: VahansComponent },
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VahanRoutingModule { }
