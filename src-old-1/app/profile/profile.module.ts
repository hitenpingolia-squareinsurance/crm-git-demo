import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataTablesModule } from "angular-datatables";
import {
  MatButtonModule,
  MatCommonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ProfileRoutingModule } from "./profile-routing.module";
import { ProfileComponent } from "./profile/profile.component";
import { ProfileRequestComponent } from "./profile-request/profile-request.component";
import { SharedModule } from "../shared/shared.module";

import { ProfileApprovalComponent } from "./profile-approval/profile-approval.component";
import { ViewProfileComponent } from "./view-profile/view-profile.component";
import { UploadProfileComponent } from "./upload-profile/upload-profile.component";
import { VievEmpDocRequestComponent } from "./viev-emp-doc-request/viev-emp-doc-request.component";
import { PosCertificateComponent } from "./pos-certificate/pos-certificate.component";

import { MatPaginatorModule } from "@angular/material/paginator";
import { MatListModule } from "@angular/material/list";
import { MatDividerModule } from "@angular/material/divider";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgxSpinnerModule } from "ngx-spinner";

// import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    ProfileComponent,
    PosCertificateComponent,
    ProfileRequestComponent,
    ProfileApprovalComponent,
    ViewProfileComponent,
    UploadProfileComponent,
    VievEmpDocRequestComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatCommonModule,
    ProfileRoutingModule,
    DataTablesModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    BsDatepickerModule,
    MatPaginatorModule,
    MatListModule,
    MatDividerModule,
    ScrollingModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
  ],
  entryComponents: [
    ProfileApprovalComponent,
    PosCertificateComponent,
    UploadProfileComponent,
  ],
})
export class ProfileModule {}
