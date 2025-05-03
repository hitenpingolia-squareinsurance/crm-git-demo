import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PushNotificationRoutingModule } from './push-notification-routing.module';
import { PushnotificationComponent } from './pushnotification/pushnotification.component';


@NgModule({
  declarations: [PushnotificationComponent],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,DataTablesModule,MatDialogModule,NgMultiSelectDropDownModule,
    PushNotificationRoutingModule
  ]
})

export class PushNotificationModule { }
