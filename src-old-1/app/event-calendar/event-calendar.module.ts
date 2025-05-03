import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from "angularx-flatpickr";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventCalendarRoutingModule } from './event-calendar-routing.module';
import { EventViewComponent } from './event-view/event-view.component';
import { MatDialogModule } from '@angular/material';

import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { EditEventComponent } from './edit-event/edit-event.component';
import { EventsComponent } from './events/events.component';
import { DataTablesModule } from "angular-datatables";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

@NgModule({
  declarations: [EventViewComponent, EditEventComponent, EventsComponent],
  imports: [
    CommonModule,
    MatDialogModule,
     CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),DataTablesModule,
    FlatpickrModule.forRoot(),
    FormsModule,ReactiveFormsModule,
    EventCalendarRoutingModule,
    NgMultiSelectDropDownModule
  ],
  entryComponents: [EditEventComponent]
})
export class EventCalendarModule { }
