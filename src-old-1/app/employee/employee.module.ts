import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatDividerModule } from "@angular/material/divider";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { SharedModule } from "../shared/shared.module";
import { EmployeeRoutingModule } from "./employee-routing.module";
import { AddEmployeeComponent } from "./add-employee/add-employee.component";
import { ViewEmployeeComponent } from "./view-employee/view-employee.component";
import { AddMastersModalComponent } from "./employee-masters/add-masters-modal/add-masters-modal.component";
import { EditMastersModalComponent } from "./employee-masters/edit-masters-modal/edit-masters-modal.component";
import { EmployeeMastersComponent } from "./employee-masters/employee-masters.component";
import { EditEmployeeComponent } from "./edit-employee/edit-employee.component";
import { SalaryEditComponent } from "./salary-edit/salary-edit.component";
import { QuestionnaireComponent } from "./questionnaire/questionnaire.component";
import { QuestionnaireDetailsComponent } from "./questionnaire-details/questionnaire-details.component";
import { HerirarchyUpdateComponent } from "./herirarchy-update/herirarchy-update.component";
import { EmployeeResignDetailsComponent } from "./employee-resign-details/employee-resign-details.component";
import { NocDetailsComponent } from "./noc-details/noc-details.component";
import { EmployeeResignComponent } from "./employee-resign/employee-resign.component";

import { RightsFormPopupComponent } from "./rights-form-popup/rights-form-popup.component";
import { RightsViewComponent } from "./rights-view/rights-view.component";
import { AddDetailsComponent } from "./add-details/add-details.component";
import { ServiceLocationComponent } from "./service-location/service-location.component";
@NgModule({
  declarations: [
    AddEmployeeComponent,
    QuestionnaireDetailsComponent,
    ViewEmployeeComponent,
    AddMastersModalComponent,
    EditMastersModalComponent,
    EmployeeMastersComponent,
    EditEmployeeComponent,
    SalaryEditComponent,
    QuestionnaireComponent,
    HerirarchyUpdateComponent,
    EmployeeResignDetailsComponent,
    NocDetailsComponent,

    EmployeeResignComponent,
    RightsViewComponent,
    RightsFormPopupComponent,
    AddDetailsComponent,
    ServiceLocationComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    EmployeeRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    BsDatepickerModule,
    MatDialogModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
    ScrollingModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ],

  entryComponents: [
    HerirarchyUpdateComponent,
    AddMastersModalComponent,
    SalaryEditComponent,
    QuestionnaireDetailsComponent,
    EditMastersModalComponent,
    EmployeeResignDetailsComponent,
    RightsFormPopupComponent,
  ],
})
export class EmployeeModule {}
