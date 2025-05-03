import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { MatDialogModule } from "@angular/material/dialog";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { ContestRoutingModule } from './contest-routing.module';
import { ViewContestComponent } from './view-contest/view-contest.component';
import { ContestPopupComponent } from './contest-popup/contest-popup.component';

import { NgxSpinnerModule } from "ngx-spinner";

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [ViewContestComponent, ContestPopupComponent],
  imports: [
    CommonModule, FormsModule,NgxSpinnerModule,MatProgressSpinnerModule, ReactiveFormsModule, DataTablesModule, MatDialogModule, NgMultiSelectDropDownModule,
    BsDatepickerModule, ContestRoutingModule, MatPaginatorModule, MatListModule, MatDividerModule, ScrollingModule, MatIconModule,
  ],
  entryComponents: [ContestPopupComponent]
})
export class ContestModule { }
