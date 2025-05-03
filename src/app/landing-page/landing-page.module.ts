import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { HealthLangingPageComponent } from './health-langing-page/health-langing-page.component';


@NgModule({
  declarations: [HealthLangingPageComponent],
  imports: [
    CommonModule,
    LandingPageRoutingModule,FormsModule,ReactiveFormsModule,DataTablesModule,SharedModule,NgMultiSelectDropDownModule
  ]
})
export class LandingPageModule { }
