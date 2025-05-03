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
import { PaginationModule } from '../../app-pagination/app-pagination.module';

import { PmsSectionRoutingModule } from './pms-section-routing.module';
import { TargetMultiMonthReportComponent } from './target-multi-month-report/target-multi-month-report.component';
import { PmsTargetsReportComponent } from './pms-targets-report/pms-targets-report.component';
import { TargetAchievementDetailsComponent } from './modal/target-achievement-details/target-achievement-details.component';
import { SalaryReportComponent } from './salary-report/salary-report.component';
import { PmsTargetBusinessDetailsComponent } from './modal/pms-target-business-details/pms-target-business-details.component';
import { TargetAchievementDetailsOldComponent } from './modal/target-achievement-details-old/target-achievement-details-old.component';
import { IncentiveReportComponent } from './incentive-report/incentive-report.component';

@NgModule({
  declarations: [TargetMultiMonthReportComponent, PmsTargetsReportComponent, TargetAchievementDetailsComponent, SalaryReportComponent, PmsTargetBusinessDetailsComponent, TargetAchievementDetailsOldComponent, IncentiveReportComponent],

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
    PaginationModule,
    PmsSectionRoutingModule
  ],

  entryComponents: [TargetAchievementDetailsComponent, TargetAchievementDetailsOldComponent, PmsTargetBusinessDetailsComponent]

})
export class PmsSectionModule { }
