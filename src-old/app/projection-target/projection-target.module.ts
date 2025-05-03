import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from "ngx-spinner";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ProjectionTargetRoutingModule } from './projection-target-routing.module';
import { ProjectionTargetListComponent } from './projection-target-list/projection-target-list.component';
import { HolidaysListComponent } from './holidays-list/holidays-list.component';
import { HolidayLocationsListComponent } from '../modals/projection-target/holiday-locations-list/holiday-locations-list.component';


@NgModule({
  declarations: [ProjectionTargetListComponent, HolidaysListComponent, HolidayLocationsListComponent],
  imports: [
    CommonModule,
    CommonModule,
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgxSpinnerModule,
    MatDialogModule,
    MatTabsModule,
    MatSelectModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    NgxMatSelectSearchModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    ProjectionTargetRoutingModule
  ],

  entryComponents: [HolidayLocationsListComponent]

})
export class ProjectionTargetModule { }
