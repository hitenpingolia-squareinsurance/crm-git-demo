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

import { GoalManagementSystemRoutingModule } from './goal-management-system-routing.module';
import { GoalManagementDetailsComponent } from './goal-management-details/goal-management-details.component';
import { LobwiseTargetMasterComponent } from './lobwise-target-master/lobwise-target-master.component';
import { ProductLeaderComponent } from './product-leader/product-leader.component';
import { GivenTargetMasterComponent } from './given-target-master/given-target-master.component';
import { SalaryReportsComponent } from './salary-reports/salary-reports.component';
import { PaginationModule } from '../app-pagination/app-pagination.module';

@NgModule({
  declarations: [
    GoalManagementDetailsComponent,
    LobwiseTargetMasterComponent,
    ProductLeaderComponent,
    GivenTargetMasterComponent,
    SalaryReportsComponent
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
    GoalManagementSystemRoutingModule,
    PaginationModule
  ]

})

export class GoalManagementSystemModule { }
