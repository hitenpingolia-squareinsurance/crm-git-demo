import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FetchUnknownFilesComponent } from './fetch-unknown-files/fetch-unknown-files.component';


const routes: Routes = [
  { path: "Reports", component: FetchUnknownFilesComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnknownWindowRoutingModule { }
