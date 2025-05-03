import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAssestComponent } from './create-assest/create-assest.component';


const routes: Routes = [
  { path: "createitem", component: CreateAssestComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
