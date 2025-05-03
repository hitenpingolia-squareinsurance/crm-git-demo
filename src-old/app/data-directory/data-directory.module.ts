import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { DataDirectoryRoutingModule } from './data-directory-routing.module';
import { ViewDataComponent } from './view-data/view-data.component';
import { AddDataComponent } from './add-data/add-data.component';
import { ViewMoreComponent } from './view-more/view-more.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { DataDirectoryFollowupComponent } from './data-directory-followup/data-directory-followup.component';


@NgModule({
  declarations: [ViewDataComponent, AddDataComponent, ViewMoreComponent, DataDirectoryFollowupComponent],
  imports: [
    CommonModule,
    DataDirectoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    DataTablesModule,
    MatDialogModule,
    BsDatepickerModule
  ],
  entryComponents: [AddDataComponent,ViewMoreComponent,DataDirectoryFollowupComponent],
})
export class DataDirectoryModule { }
