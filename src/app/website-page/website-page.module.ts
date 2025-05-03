import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CKEditorModule } from "ckeditor4-angular";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { MatDialogModule } from "@angular/material/dialog";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { WebsitePageRoutingModule } from './website-page-routing.module';
// import { AddPageComponent } from './add-page/add-page.component';
// import { AddPageTableComponent } from './add-page-table/add-page-table.component';
// import { AddSectionDetailsComponent } from './add-section-details/add-section-details.component';
import { PagesComponent } from './pages/pages.component';
import { SectionComponent } from './section/section.component';
import { ViewSectionDetailsComponent } from './view-section-details/view-section-details.component';
// import { EditPageComponent } from './edit-page/edit-page.component';
// import { EditPageSectionComponent } from './edit-page-section/edit-page-section.component';
// import { EditPageDetailsComponent } from './edit-page-details/edit-page-details.component';
import { CompanyMessageComponent } from './company-message/company-message.component';
// import { AddCompanyMsgComponent } from './add-company-msg/add-company-msg.component';


@NgModule({
  declarations: [PagesComponent, SectionComponent, ViewSectionDetailsComponent, CompanyMessageComponent],
  imports: [
    CommonModule,
    WebsitePageRoutingModule, CKEditorModule, FormsModule, ReactiveFormsModule, DataTablesModule, MatDialogModule, NgMultiSelectDropDownModule, BsDatepickerModule
  ],
  entryComponents: []

})
export class WebsitePageModule { }
