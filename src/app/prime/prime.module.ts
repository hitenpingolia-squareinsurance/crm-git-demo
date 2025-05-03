import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PrimeRoutingModule } from './prime-routing.module';
import { ManagerequestsComponent } from './managerequests/managerequests.component';



@NgModule({
  declarations: [ManagerequestsComponent ],
  imports: [
    CommonModule,
    PrimeRoutingModule,
    FormsModule,ReactiveFormsModule,DataTablesModule,MatDialogModule,NgMultiSelectDropDownModule,BsDatepickerModule
  ],
  entryComponents: []
})
export class PrimeModule { }
