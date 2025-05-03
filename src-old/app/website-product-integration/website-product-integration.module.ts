import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { WebsiteProductIntegrationRoutingModule } from './website-product-integration-routing.module';

import { ViewPlanBenifitComponent } from './PA/view-plan-benifit/view-plan-benifit.component';
import { ViewBourcherHealthComponent } from './PA/bourcher_health/view-bourcher-health/view-bourcher-health.component';
import { ViewHospitalListComponent } from './PA/Hospital-list/view-hospital-list/view-hospital-list.component';

import { AddPlanBenifitComponent } from './PA/add-plan-benifit/add-plan-benifit.component';
// import { AddBourcherHealthComponent } from './PA/bourcher_health/add-bourcher-health/add-bourcher-health.component';
import { AddHospitalListComponent } from './PA/Hospital-list/add-hospital-list/add-hospital-list.component';

import { AddBourcherHealthComponent } from './PA/bourcher_health/add-bourcher-health/add-bourcher-health.component';
import { EditPlanBenefitComponent } from './PA/edit-plan-benefit/edit-plan-benefit.component';
import { AddHighlightComponent } from './PA/highlight-label-new/add-highlight/add-highlight.component';
import { ViewHighlightComponent } from './PA/highlight-label-new/view-highlight/view-highlight.component';
import { EditHighlightComponent } from './PA/highlight-label-new/edit-highlight/edit-highlight.component';
import { ViewYoutubeComponent } from './PA/youtube-url-new/view-youtube/view-youtube.component';
import { AddYoutubeComponent } from './PA/youtube-url-new/add-youtube/add-youtube.component';
import { EditYoutubeComponent } from './PA/youtube-url-new/edit-youtube/edit-youtube.component';

// import { AddBourcherHealthComponent } from '../website-health-section/bourcher_health/add-bourcher-health/add-bourcher-health.component';

@NgModule({
  declarations: [ViewPlanBenifitComponent, ViewBourcherHealthComponent, ViewHospitalListComponent,
    AddPlanBenifitComponent, AddHospitalListComponent,
    AddBourcherHealthComponent, EditPlanBenefitComponent, AddHighlightComponent, ViewHighlightComponent, EditHighlightComponent, ViewYoutubeComponent, AddYoutubeComponent, EditYoutubeComponent],
  imports: [
    CommonModule, MatDialogModule, FormsModule, DataTablesModule, ReactiveFormsModule, NgMultiSelectDropDownModule,
    WebsiteProductIntegrationRoutingModule
  ],
  entryComponents: [AddPlanBenifitComponent, AddHospitalListComponent, AddBourcherHealthComponent, EditPlanBenefitComponent, AddHighlightComponent, EditHighlightComponent, AddYoutubeComponent, EditYoutubeComponent],

})
export class WebsiteProductIntegrationModule { }
