import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { NgxSpinnerModule } from "ngx-spinner";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TimepickerModule } from "ngx-bootstrap/timepicker";

// import { AgentsReportDetailsComponent} from '../modals/dsr-related/agents-report-details/agents-report-details.component';
import { AddFollowUpsComponent } from '../modals/dsr-related/add-follow-ups/add-follow-ups.component';
import { ActivityTrackComponent } from '../modals/dsr-related/activity-track/activity-track.component';
import { ShareAspirantComponent } from '../modals/dsr-related/share-aspirant/share-aspirant.component';
import { ClubCriteriaComponent } from '../modals/dsr-related/club-criteria/club-criteria.component';

import { DsrModuleRoutingModule } from './dsr-module-routing.module';
import { DsrRmReportsComponent } from './dsr-rm-reports/dsr-rm-reports.component';
import { SharedModule } from "../shared/shared.module";
import { FilterModuleModule } from "../filter-module/filter-module.module";
import { ClubManagerWindowComponent } from './club-manager-window/club-manager-window.component';
import { ClubManagerReportsComponent } from './club-manager-reports/club-manager-reports.component';
import { AddEmployeeCallComponent } from '../modals/dsr-related/add-employee-call/add-employee-call.component';


@NgModule({

  declarations: [
    DsrRmReportsComponent,
    // AgentsReportDetailsComponent,
    AddFollowUpsComponent,
    ActivityTrackComponent,
    ShareAspirantComponent,
    ClubCriteriaComponent,
    ClubManagerWindowComponent,
    ClubManagerReportsComponent,
    AddEmployeeCallComponent
  ],

  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatToolbarModule, MatListModule, MatDividerModule, ScrollingModule, MatIconModule,
    MatMenuModule, MatProgressSpinnerModule, MatTabsModule,
    DataTablesModule,
    NgxSpinnerModule,
    SharedModule,
    FilterModuleModule,
    DsrModuleRoutingModule
  ],

  entryComponents: [
    // AgentsReportDetailsComponent,
    AddFollowUpsComponent,
    ActivityTrackComponent,
    ShareAspirantComponent,
    ClubCriteriaComponent,
    AddEmployeeCallComponent
  ]

})
export class DsrModuleModule { }
