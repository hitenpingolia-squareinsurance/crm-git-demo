import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from "../shared/shared.module";

import { EParnerQuotationsRoutingModule } from './e-parner-quotations-routing.module';
import { EPartnerQuotationComponent } from './e-partner-quotation/e-partner-quotation.component';

import { NgxSpinnerModule } from "ngx-spinner";

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [EPartnerQuotationComponent],
  imports: [
    CommonModule,
    EParnerQuotationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatDialogModule,
    SharedModule,
    MatPaginatorModule,
    MatListModule,
    MatDividerModule,
    ScrollingModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule
  ]
})
export class EParnerQuotationsModule { }
