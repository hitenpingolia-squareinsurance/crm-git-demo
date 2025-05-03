import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationModule } from '../app-pagination/app-pagination.module';
import { HrmsRoutingModule } from './hrms-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from "../shared/shared.module";
import { TeamInoutComponent } from './team-inout/team-inout.component';



@NgModule({
  declarations: [TeamInoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule,
    MatDialogModule,
    SharedModule,
    HrmsRoutingModule,
    PaginationModule,
  ],
  
})
export class HrmsModule { }

