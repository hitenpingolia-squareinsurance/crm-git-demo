import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule, MatCommonModule,  MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';

import { SurveyRoutingModule } from './survey-routing.module';
import { SharedModule } from "../shared/shared.module";

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { ManageSurveyComponent } from './manage-survey/manage-survey.component';
import { ViewDetailsComponent } from './view-details/view-details.component';


@NgModule({
  declarations: [
    CreateSurveyComponent,
    ViewSurveyComponent,
    
    ManageSurveyComponent,
    ViewDetailsComponent
  ],

  imports: [
    CommonModule,
    SurveyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    DataTablesModule,
    BsDatepickerModule,
    SharedModule
  ],

  entryComponents: []
})

export class SurveyModule { }
