import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MailTemplateComponent} from './mail-template/mail-template.component';
import {ViewTemplateComponent} from './view-template/view-template.component';


const routes: Routes = [
  { path: 'add_templates', component: MailTemplateComponent },
  { path: 'view_templates', component: ViewTemplateComponent },
  { path: 'edit_template/:editId', component: MailTemplateComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailTemplateRoutingModule { }
