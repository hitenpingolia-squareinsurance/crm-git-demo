import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";
import { SquareMeetRoutingModule } from './square-meet-routing.module';
import {SquaremeetDetailComponent} from './squaremeet-detail/squaremeet-detail.component';
import { ViewTimeComponent } from './view-time/view-time.component';
import {AddMeeturlComponent} from './add-meeturl/add-meeturl.component';
import {DigitalMeetingComponent} from './digital-meeting/digital-meeting.component';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [SquaremeetDetailComponent,ViewTimeComponent,AddMeeturlComponent,DigitalMeetingComponent],
  imports: [
    CommonModule,MatDialogModule,FormsModule,ReactiveFormsModule,DataTablesModule,SharedModule,NgMultiSelectDropDownModule,
    SquareMeetRoutingModule,BsDatepickerModule
  ],
  entryComponents: [SquaremeetDetailComponent,ViewTimeComponent]
})


export class SquareMeetModule { }
