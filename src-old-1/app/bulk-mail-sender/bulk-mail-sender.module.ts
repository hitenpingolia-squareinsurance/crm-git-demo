import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { CKEditorModule } from "ckeditor4-angular";

import { BulkMailSenderRoutingModule } from "./bulk-mail-sender-routing.module";
import { BulkMailComponent } from "./bulk-mail/bulk-mail.component";
import { MailFormComponent } from "./mail-form/mail-form.component";
import { ViewComponent } from "./view/view.component";
import { TestMailComponent } from "./test-mail/test-mail.component";
import { DetailsComponent } from "./details/details.component";
import { RecipientsComponent } from "./recipients/recipients.component";

@NgModule({
  declarations: [
    BulkMailComponent,
    MailFormComponent,
    ViewComponent,
    TestMailComponent,
    DetailsComponent,
    RecipientsComponent,
  ],
  imports: [
    CommonModule,
    BsDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatDialogModule,
    NgMultiSelectDropDownModule,
    BulkMailSenderRoutingModule,
    CKEditorModule,
  ],
  entryComponents: [
    MailFormComponent,
    ViewComponent,
    TestMailComponent,
    DetailsComponent,
    RecipientsComponent,
  ],
})
export class BulkMailSenderModule {}
