import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { ViewAllNotificationComponent } from './view-all-notification/view-all-notification.component';


@NgModule({
  declarations: [ViewAllNotificationComponent],
  imports: [
    CommonModule,
    NotificationRoutingModule
  ]
})
export class NotificationModule { }
