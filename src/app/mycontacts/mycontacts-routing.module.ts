import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyContactComponent } from './my-contact/my-contact.component';


const routes: Routes = [
  { path: 'my-contact', component: MyContactComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MycontactsRoutingModule { }
