 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from "../shared/shared.module";
import { ControlCasesRoutingModule } from './control-cases-routing.module';
import { ControlCasesOnlineComponent } from './control-cases-online/control-cases-online.component';


@NgModule({
  declarations: [ControlCasesOnlineComponent],
   


  imports: [
    CommonModule,
    ControlCasesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    BsDatepickerModule,
    NgMultiSelectDropDownModule,
    MatDialogModule,
    SharedModule

    ],
})
export class ControlCasesModule { }
