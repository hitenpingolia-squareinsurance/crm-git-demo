import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenewalNotificationRoutingModule } from './renewal-notification-routing.module';
import {ViewNotificationComponent} from './view-notification/view-notification.component';
import {SendnotificationComponent} from './sendnotification/sendnotification.component';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";
import { UpdateNotificationComponent } from './update-notification/update-notification.component';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";


@NgModule({
  declarations: [ViewNotificationComponent,SendnotificationComponent, UpdateNotificationComponent],
  imports: [
    CommonModule,MatDialogModule,FormsModule,ReactiveFormsModule,DataTablesModule,SharedModule,
    RenewalNotificationRoutingModule,NgMultiSelectDropDownModule

  ], entryComponents: [UpdateNotificationComponent]
})
export class RenewalNotificationModule { }
