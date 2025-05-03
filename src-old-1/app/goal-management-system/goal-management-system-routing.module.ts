import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoalManagementDetailsComponent } from './goal-management-details/goal-management-details.component';
import { ProductLeaderComponent } from './product-leader/product-leader.component';
import { GivenTargetMasterComponent } from './given-target-master/given-target-master.component';
import { SalaryReportsComponent } from './salary-reports/salary-reports.component';

const routes: Routes = [
  { path: 'employee-targets', component:GoalManagementDetailsComponent },
  { path: 'salary-reports', component:SalaryReportsComponent },
  { path: 'product-leader', component:ProductLeaderComponent },
  { path: 'given-targets-master', component:GivenTargetMasterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoalManagementSystemRoutingModule { }
