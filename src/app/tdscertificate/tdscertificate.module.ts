import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TDSCertificateRoutingModule } from './tdscertificate-routing.module';
import { CertificateViewComponent } from './certificate-view/certificate-view.component';
import { SharedModule } from '../shared/shared.module';


import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { TdsComponent } from './tds/tds.component';

import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [CertificateViewComponent, TdsComponent],
  imports: [
    CommonModule,
    TDSCertificateRoutingModule,FormsModule,ReactiveFormsModule,DataTablesModule,NgMultiSelectDropDownModule,SharedModule,MatProgressBarModule
    
  ]
})
export class TDSCertificateModule { }
