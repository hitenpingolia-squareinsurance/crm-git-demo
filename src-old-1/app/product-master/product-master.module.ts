import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CKEditorModule } from "ckeditor4-angular";
import { ProductMasterRoutingModule } from './product-master-routing.module';
import { ProductReportComponent } from './product-report/product-report.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductUpdateComponent } from './product-update/product-update.component';


@NgModule({
  declarations: [ProductReportComponent, ProductFormComponent, ProductUpdateComponent],
  imports: [
    CommonModule,
    ProductMasterRoutingModule,
    ReactiveFormsModule, 
    DataTablesModule, 
    BsDatepickerModule, 
    MatDialogModule, 
    NgMultiSelectDropDownModule,
    CKEditorModule
  ],

  entryComponents: [
    ProductFormComponent,
    ProductUpdateComponent
  ]
})
export class ProductMasterModule { }
