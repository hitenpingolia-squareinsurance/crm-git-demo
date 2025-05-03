import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from "../../shared/shared.module";
import { PaginationModule } from 'src/app/app-pagination/app-pagination.module';
import { LeavesRoutingModule } from './leaves-routing.module';
import { LeavesComponent } from './leaves.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';

import { DataTablesModule } from 'angular-datatables';

import { MatListModule } from "@angular/material/list";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NgxSpinnerModule } from "ngx-spinner";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [LeavesComponent, ApplyLeaveComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule,
    MatDialogModule,
    MatFormFieldModule,
    SharedModule,
    LeavesRoutingModule,
    PaginationModule,
    MatTabsModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
    ScrollingModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    NgxSpinnerModule,
    BsDatepickerModule,
    NgxMatSelectSearchModule,
    MatSlideToggleModule,
    MatAutocompleteModule
    
  ],
  entryComponents: [
    ApplyLeaveComponent
  ],
})
export class LeavesModule { }
