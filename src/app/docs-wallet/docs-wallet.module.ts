import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DocsWalletRoutingModule } from './docs-wallet-routing.module';
import { AddDocsWalletComponent } from './add-docs-wallet/add-docs-wallet.component';
import { ViewDocsWalletComponent } from './view-docs-wallet/view-docs-wallet.component';



@NgModule({
  declarations: [AddDocsWalletComponent, ViewDocsWalletComponent],
  imports: [
    CommonModule,DataTablesModule,ReactiveFormsModule,NgMultiSelectDropDownModule,
    DocsWalletRoutingModule,MatDialogModule,FormsModule,SharedModule,BsDatepickerModule
  ],
  entryComponents: [AddDocsWalletComponent]
})
export class DocsWalletModule { }
