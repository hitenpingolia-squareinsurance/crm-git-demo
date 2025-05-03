import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageExpensesComponent } from './manage-expenses/manage-expenses.component';

const routes: Routes = [
  { path: 'manage', component: ManageExpensesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseSectionRoutingModule { }
