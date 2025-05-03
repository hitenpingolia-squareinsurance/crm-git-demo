import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { SquaremasterRoutingModule } from './squaremaster-routing.module';
import { MastertableComponent } from './mastertable/mastertable.component';
import { MasterdataComponent } from './masterdata/masterdata.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [MastertableComponent, MasterdataComponent],
  imports: [
    CommonModule,NgMultiSelectDropDownModule,
    SquaremasterRoutingModule,
    MatDialogModule,
    FormsModule,ReactiveFormsModule,
    DataTablesModule
  ]
})
export class SquaremasterModule { }
