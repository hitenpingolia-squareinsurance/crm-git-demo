import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from "angular-datatables";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DataDictionaryRoutingModule } from './data-dictionary-routing.module';
import { ViewDataLeadComponent } from './view-data-lead/view-data-lead.component';
import { ViewDataListComponent } from './view-data-list/view-data-list.component';



@NgModule({
  declarations: [ViewDataLeadComponent, ViewDataListComponent],
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule,
    DataDictionaryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
  ]
})
export class DataDictionaryModule { }
