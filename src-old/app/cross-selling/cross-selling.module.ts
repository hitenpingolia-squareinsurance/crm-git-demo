import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
// import { SearchPipe } from '../search.pipe';

import { CrossSellingRoutingModule } from './cross-selling-routing.module';
import { DailyTrackerComponent } from './daily-tracker/daily-tracker.component';
import { ManagerReportComponent } from './manager-report/manager-report.component';
import { RmReportComponent } from './rm-report/rm-report.component';

@NgModule({
  declarations: [
    DailyTrackerComponent,
    // SearchPipe,
    ManagerReportComponent,
    RmReportComponent
  ],

  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgxSpinnerModule,
    MatDialogModule,
    MatSelectModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    NgxMatSelectSearchModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    CrossSellingRoutingModule
  ]

})

export class CrossSellingModule { }
