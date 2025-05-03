import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";
// import { BrowserModule } from '@angular/platform-browser';


import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AssetsmanagementRoutingModule } from './assetsmanagement-routing.module';

import { AssetsManagementComponent } from './assets-management/assets-management.component';

import { InventoryComponent } from './inventory/inventory.component';
import { InvetoryApprovalComponent } from './invetory-approval/invetory-approval.component';
import { ItemsrnoComponent } from './itemsrno/itemsrno.component';
import { AssestActionStatusViewComponent } from './assest-action-status-view/assest-action-status-view.component';
import { AssestViewComponent } from './assest-view/assest-view.component';


@NgModule({
  declarations: [AssetsManagementComponent, InvetoryApprovalComponent, InventoryComponent,ItemsrnoComponent,  AssestActionStatusViewComponent, AssestViewComponent],
  imports: [
    CommonModule,
    AssetsmanagementRoutingModule, SharedModule, FormsModule, ReactiveFormsModule, DataTablesModule, MatDialogModule, NgMultiSelectDropDownModule
  ],
  entryComponents: [ ItemsrnoComponent, InvetoryApprovalComponent]

})
export class AssetsmanagementModule { }
