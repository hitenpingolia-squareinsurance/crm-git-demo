import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { ManageSurveyComponent } from './manage-survey/manage-survey.component';
import { ViewDetailsComponent } from './view-details/view-details.component';

const routes: Routes = [
  { path: 'survey/create-requests', component: CreateSurveyComponent },
  { path: 'survey/create-requests/:id', component: CreateSurveyComponent },
  { path: 'survey/edit-requests/:id', component: CreateSurveyComponent, data : {formType : 'Edit'} },
  { path: 'survey/view-requests', component: ViewSurveyComponent },
  { path: 'mis-reports/inspection', component: ViewSurveyComponent },
  { path: 'mis-reports/inspection-pan-india', component: ViewSurveyComponent },
  { path: 'survey/manage-requests', component: ManageSurveyComponent },
  { path: 'survey/view-details/:Id', component: ViewDetailsComponent },
  { path: 'survey/view-details/:Id/:RightType', component: ViewDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }
