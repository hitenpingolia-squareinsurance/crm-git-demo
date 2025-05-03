import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PushnotificationComponent } from './pushnotification/pushnotification.component';

const routes: Routes = [
  { path: 'push_notification', component: PushnotificationComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PushNotificationRoutingModule { }
