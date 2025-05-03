import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { MatDialogModule } from "@angular/material/dialog";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
//import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';

import { MatTabsModule } from "@angular/material/tabs";

import { NgxSpinnerModule } from "ngx-spinner";
import { MatListModule } from "@angular/material/list";
import { MatDividerModule } from "@angular/material/divider";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
//import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { FilterModuleModule } from "../filter-module/filter-module.module";
import { BusinessManagementRoutingModule } from "./business-management-routing.module";
import { MyBusinessInfoComponent } from "./my-business-info/my-business-info.component";
//import { SearchPipe } from '../search.pipe';
import { LifeRenewalsComponent } from "./life-renewals/life-renewals.component";
import { LifeGroupSrComponent } from "./life-group-sr/life-group-sr.component";
import { SrReportComponent } from "./sr-report/sr-report.component";
import { HealthGroupSrComponent } from "./health-group-sr/health-group-sr.component";
import { PaGroupSrComponent } from "./pa-group-sr/pa-group-sr.component";
import { LifeRenewalsReportComponent } from "./life-renewals-report/life-renewals-report.component";

import { GroupSrInsuredComponent } from "../modals/sr-related/group-sr-insured/group-sr-insured.component";
import { GroupSrEndorsementTrackComponent } from "../modals/sr-related/group-sr-endorsement-track/group-sr-endorsement-track.component";
import { UploadGroupInsuredExcelComponent } from "../modals/sr-related/upload-group-insured-excel/upload-group-insured-excel.component";
import { EditLifeRenewalPremiumComponent } from "../modals/life-renewals/edit-life-renewal-premium/edit-life-renewal-premium.component";
import { UpdateRenewalDateComponent } from "../modals/life-renewals/update-renewal-date/update-renewal-date.component";
import { LifeProductsListComponent } from "./life-products-list/life-products-list.component";
import { AddLifeProductsComponent } from "./add-life-products/add-life-products.component";
import { LifeRenewalReportComponent } from "./life-renewal-report/life-renewal-report.component";
import { HealthInstallmentReportComponent } from "./health-installment-report/health-installment-report.component";
import {QcTransferReportComponent} from "./qc-transfer-report/qc-transfer-report.component";





@NgModule({
  declarations: [
    HealthGroupSrComponent,
    LifeProductsListComponent,
    AddLifeProductsComponent,
    LifeRenewalReportComponent,
    EditLifeRenewalPremiumComponent,
    UpdateRenewalDateComponent,
    GroupSrInsuredComponent,
    GroupSrEndorsementTrackComponent,
    UploadGroupInsuredExcelComponent,
    LifeRenewalsReportComponent,
    SrReportComponent,
    MyBusinessInfoComponent,
    LifeRenewalsComponent,
    LifeGroupSrComponent,
    PaGroupSrComponent,
    HealthInstallmentReportComponent,
    QcTransferReportComponent
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    BusinessManagementRoutingModule,
    FilterModuleModule,
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,

    MatSelectModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatListModule,
    MatDividerModule,
    ScrollingModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    MatSlideToggleModule,
  ],
  entryComponents: [
    GroupSrInsuredComponent,
    AddLifeProductsComponent,
    GroupSrEndorsementTrackComponent,
    UploadGroupInsuredExcelComponent,
    EditLifeRenewalPremiumComponent,
    UpdateRenewalDateComponent,
  ],
})
export class BusinessManagementModule {}
