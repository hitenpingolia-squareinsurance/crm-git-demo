import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { NgxSpinnerModule } from "ngx-spinner";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TimepickerModule } from "ngx-bootstrap/timepicker";

import { ExpenseSectionRoutingModule } from './expense-section-routing.module';
import { ManageExpensesComponent } from './manage-expenses/manage-expenses.component';
import { ExpenseDetailsComponent } from '../../modals/goal-management/expenses/expense-details/expense-details.component';
import { ExpenseTypeMasterComponent } from '../../modals/goal-management/expenses/expense-type-master/expense-type-master.component';
import { UploadExpenseExcelComponent } from '../../modals/goal-management/expenses/upload-expense-excel/upload-expense-excel.component';
import { AddExtraExpensesComponent } from '../../modals/goal-management/expenses/add-extra-expenses/add-extra-expenses.component';
import { EmployeeExpenseDetailsComponent } from '../../modals/goal-management/expenses/employee-expense-details/employee-expense-details.component';

@NgModule({
  declarations: [
    ManageExpensesComponent,
    ExpenseDetailsComponent,
    ExpenseTypeMasterComponent,
    UploadExpenseExcelComponent,
    AddExtraExpensesComponent,
    EmployeeExpenseDetailsComponent
  ],

  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatToolbarModule, MatListModule, MatDividerModule, ScrollingModule, MatIconModule,
    MatMenuModule, MatProgressSpinnerModule, MatTabsModule,
    DataTablesModule,
    NgxSpinnerModule,
    ExpenseSectionRoutingModule
  ],

  entryComponents: [
    ExpenseDetailsComponent,
    ExpenseTypeMasterComponent,
    UploadExpenseExcelComponent,
    AddExtraExpensesComponent,
    EmployeeExpenseDetailsComponent
  ]

})
export class ExpenseSectionModule { }
