import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAllNotificationComponent } from './view-all-notification/view-all-notification.component';

const routes: Routes = [{
    path: 'view-all-notifications', component: ViewAllNotificationComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
