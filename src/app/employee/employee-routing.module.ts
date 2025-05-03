import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddEmployeeComponent } from "./add-employee/add-employee.component";
import { EditEmployeeComponent } from "./edit-employee/edit-employee.component";
import { ViewEmployeeComponent } from "./view-employee/view-employee.component";
import { EmployeeMastersComponent } from "./employee-masters/employee-masters.component";
import { QuestionnaireComponent } from "./questionnaire/questionnaire.component";
import { EmployeeResignComponent } from "./employee-resign/employee-resign.component";
import { RightsViewComponent } from "./rights-view/rights-view.component";

const routes: Routes = [
  { path: "add-employee", component: AddEmployeeComponent },
  { path: "edit-employee/:Id", component: AddEmployeeComponent },
  { path: "view-employee", component: ViewEmployeeComponent },
  { path: "employee-directory", component: ViewEmployeeComponent },
  { path: "salary-employee", component: ViewEmployeeComponent },
  { path: "operation-emp-rights", component: ViewEmployeeComponent },
  { path: "employee-bqc-details", component: ViewEmployeeComponent },
  { path: "coreline", component: EmployeeMastersComponent },
  { path: "vertical", component: EmployeeMastersComponent },
  { path: "profile", component: EmployeeMastersComponent },
  { path: "designation", component: EmployeeMastersComponent },
  { path: "department", component: EmployeeMastersComponent },
  { path: "grade", component: EmployeeMastersComponent },
  { path: "organisation", component: EmployeeMastersComponent },
  { path: "zone", component: EmployeeMastersComponent },
  { path: "branch", component: EmployeeMastersComponent },
  { path: "service-location", component: EmployeeMastersComponent },
  { path: "regional-office", component: EmployeeMastersComponent },
  { path: "questionnaire", component: QuestionnaireComponent },

  { path: "Add-Rights", component: RightsViewComponent },

  { path: "resign-rm", component: EmployeeResignComponent },
  { path: "resign-hod", component: EmployeeResignComponent },
  { path: "resign-hr", component: EmployeeResignComponent },
  { path: "noc-ops", component: EmployeeResignComponent },
  { path: "noc-it", component: EmployeeResignComponent },
  { path: "noc-finance", component: EmployeeResignComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
