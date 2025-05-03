import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanDetailRoutingModule } from './plan-detail-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PlanComponent } from './plan/plan.component';
import { PlanFormComponent } from './plan-form/plan-form.component';
import { PlanTypeComponent } from './plan-type/plan-type.component';
import { CKEditorModule } from "ckeditor4-angular";
import { ViewFormComponent } from './view-form/view-form.component';
import { PlanUpdateComponent } from './plan-update/plan-update.component';
import { TypeUpdateComponent } from './type-update/type-update.component';





@NgModule({
  declarations: [PlanComponent, PlanFormComponent, PlanTypeComponent, ViewFormComponent, PlanUpdateComponent, TypeUpdateComponent],
  imports: [
    CommonModule,
    PlanDetailRoutingModule,
    FormsModule, 
    ReactiveFormsModule, 
    DataTablesModule, 
    BsDatepickerModule, 
    MatDialogModule, 
    NgMultiSelectDropDownModule,
    CKEditorModule
    
  ],
  
  entryComponents: [
    PlanFormComponent,
    PlanTypeComponent,
    ViewFormComponent,
    PlanUpdateComponent,
    TypeUpdateComponent
  ]
})
export class PlanDetailModule { }
