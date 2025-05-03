import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SendnotificationComponent} from './sendnotification/sendnotification.component';
import {ViewNotificationComponent} from './view-notification/view-notification.component';


const routes: Routes = [
  { path: 'send-notification', component: SendnotificationComponent },
  { path: 'view-notification', component: ViewNotificationComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenewalNotificationRoutingModule { }
