import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PosViewComponent} from './pos-view/pos-view.component';

const routes: Routes = [
  { path: 'pos_directory', component: PosViewComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosDirectoryRoutingModule { }
