import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { EventGalleryRoutingModule } from './event-gallery-routing.module';
import { EventGalleryComponent } from './event-gallery/event-gallery.component';
import { AddEventComponent } from './add-event/add-event.component';


@NgModule({
  declarations: [EventGalleryComponent, AddEventComponent],
  imports: [
    CommonModule,
    EventGalleryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatDialogModule,
    NgMultiSelectDropDownModule
  ],
  entryComponents: [AddEventComponent],
})
export class EventGalleryModule { }
