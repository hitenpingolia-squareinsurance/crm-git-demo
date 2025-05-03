import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';


import { WebsiteHealthSectionRoutingModule } from './website-health-section-routing.module';

import { ViewHospitalListComponent } from './Hospital-list/view-hospital-list/view-hospital-list.component';
import { ViewPlanBenifitComponent } from './plan-benifit/view-plan-benifit/view-plan-benifit.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ViewBourcherHealthComponent } from './bourcher_health/view-bourcher-health/view-bourcher-health.component';

@NgModule({
  declarations: [ViewHospitalListComponent, ViewPlanBenifitComponent, ViewBourcherHealthComponent],
  imports: [
    CommonModule,
    DataTablesModule, FormsModule, ReactiveFormsModule, MatDialogModule, WebsiteHealthSectionRoutingModule,NgMultiSelectDropDownModule
  ],
})
export class WebsiteHealthSectionModule { }
