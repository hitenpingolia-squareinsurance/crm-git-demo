import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MeetingRequestRoutingModule } from './meeting-request-routing.module';
import { ViewRequestComponent } from './view-request/view-request.component';
import { CreateRequestComponent } from './create-request/create-request.component';
import { MatDialogModule } from '@angular/material/dialog';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxSpinnerModule } from "ngx-spinner";

import { ViewManagerRequestComponent } from './view-manager-request/view-manager-request.component';

@NgModule({
  declarations: [ViewRequestComponent, CreateRequestComponent, ViewManagerRequestComponent],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,DataTablesModule,SharedModule,NgxSpinnerModule,MatPaginatorModule,MatListModule,MatDividerModule,
    ScrollingModule,MatIconModule,MatProgressSpinnerModule,MeetingRequestRoutingModule,NgMultiSelectDropDownModule,MatDialogModule
  ],
  entryComponents: [ViewManagerRequestComponent],
})
export class MeetingRequestModule { }
