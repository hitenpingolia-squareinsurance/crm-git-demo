import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerDirectoryRoutingModule } from './partner-directory-routing.module';
import { PartnerDirectoryComponent } from './partner-directory/partner-directory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "../shared/shared.module";
import { MatDialogModule } from '@angular/material/dialog';
import { PartnerDirectoryPopupComponent } from './partner-directory-popup/partner-directory-popup.component';


@NgModule({
  declarations: [PartnerDirectoryComponent, PartnerDirectoryPopupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    SharedModule,
    MatDialogModule,
    PartnerDirectoryRoutingModule
  ],
  entryComponents: [
    PartnerDirectoryPopupComponent,
    
  ]




})
export class PartnerDirectoryModule { }
