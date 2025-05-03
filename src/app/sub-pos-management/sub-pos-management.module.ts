import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { SubPosManagementRoutingModule } from './sub-pos-management-routing.module';
import { CreatesubposComponent } from './createsubpos/createsubpos.component';
import { ViewManageRequestComponent } from './view-manage-request/view-manage-request.component';
import { RejectsubposmodelsComponent } from './rejectsubposmodels/rejectsubposmodels.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AddMarginComponent } from './add-margin/add-margin.component';


@NgModule({
  declarations: [CreatesubposComponent, ViewManageRequestComponent, RejectsubposmodelsComponent, AddMarginComponent],
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule,
    SubPosManagementRoutingModule,
    MatDialogModule,
    BsDatepickerModule
  ],
  entryComponents: [RejectsubposmodelsComponent,AddMarginComponent]
})
export class SubPosManagementModule { }
