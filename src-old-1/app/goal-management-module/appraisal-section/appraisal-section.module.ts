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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PaginationModule } from '../../app-pagination/app-pagination.module';

import { AppraisalSectionRoutingModule } from './appraisal-section-routing.module';
import { RatingsComponent } from './ratings/ratings.component';
import { KraListComponent } from '../../modals/goal-management/kra-list/kra-list.component';
import { EditRatingsComponent } from '../../modals/goal-management/edit-ratings/edit-ratings.component';
import { RatingsUpdateLogsComponent } from '../../modals/goal-management/ratings-update-logs/ratings-update-logs.component';
import { KraMasterComponent } from './kra-master/kra-master.component';
import { AddEditKraComponent } from '../../modals/goal-management/add-edit-kra/add-edit-kra.component';
import { RatingUpdateDateMasterComponent } from './rating-update-date-master/rating-update-date-master.component';
import { RatingsCriteriaMasterComponent } from '../../modals/goal-management/ratings-criteria-master/ratings-criteria-master.component';
import { HrRatingsComponent } from './hr-ratings/hr-ratings.component';
import { EmployeeKraComponent } from './employee-kra/employee-kra.component';
import { KraListOnlyComponent } from '../../modals/goal-management/kra-list-only/kra-list-only.component';
import { AppraisalDateMasterComponent } from '../../modals/goal-management/appraisal-date-master/appraisal-date-master.component';
import { UpdateAppraisalDateComponent } from '../../modals/goal-management/update-appraisal-date/update-appraisal-date.component';
import { CreateAppraisalLetterComponent } from '../../modals/goal-management/create-appraisal-letter/create-appraisal-letter.component';

@NgModule({
  declarations: [
    RatingsComponent,
    KraListComponent,
    EditRatingsComponent,
    RatingsUpdateLogsComponent,
    KraMasterComponent,
    AddEditKraComponent,
    RatingUpdateDateMasterComponent,
    RatingsCriteriaMasterComponent,
    HrRatingsComponent,
    EmployeeKraComponent,
    KraListOnlyComponent,
    AppraisalDateMasterComponent,
    UpdateAppraisalDateComponent,
    CreateAppraisalLetterComponent
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
    PaginationModule,
    AppraisalSectionRoutingModule
  ],

  entryComponents: [
    KraListComponent, EditRatingsComponent, RatingsUpdateLogsComponent,
    AddEditKraComponent, RatingsCriteriaMasterComponent, KraListOnlyComponent,
    AppraisalDateMasterComponent, UpdateAppraisalDateComponent,
    CreateAppraisalLetterComponent
  ]

})
export class AppraisalSectionModule { }
