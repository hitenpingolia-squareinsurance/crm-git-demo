import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PosDirectoryRoutingModule } from './pos-directory-routing.module';
import { PosViewComponent } from './pos-view/pos-view.component';


@NgModule({
  declarations: [PosViewComponent],
  imports: [
    CommonModule,NgMultiSelectDropDownModule,SharedModule,DataTablesModule,MatDialogModule,FormsModule,ReactiveFormsModule,
    PosDirectoryRoutingModule
  ],
})
export class PosDirectoryModule { }
