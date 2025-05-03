import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IpBlockRoutingModule } from './ip-block-routing.module';
import { FromComponent } from './from/from.component';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [FromComponent],
  imports: [
    CommonModule,
    IpBlockRoutingModule,
    FormsModule,ReactiveFormsModule,NgMultiSelectDropDownModule
  ]
})
export class IpBlockModule { }
