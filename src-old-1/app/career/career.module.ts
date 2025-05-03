import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { CareerRoutingModule } from "./career-routing.module";
import { ViewCurrentOpeningComponent } from "./current-opening/view-current-opening/view-current-opening.component";
import { ViewRecruitmentRequestComponent } from "./recruitment-request/view-recruitment-request/view-recruitment-request.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { CKEditorModule } from "ckeditor4-angular";
import { ViewMoreComponent } from "./current-opening/view-more/view-more.component";
import { EditCurrentOpeningComponent } from "./current-opening/edit-current-opening/edit-current-opening.component";
import { CareerDetailsComponent } from './career-details/career-details.component';

@NgModule({
  declarations: [
    ViewCurrentOpeningComponent,
    ViewRecruitmentRequestComponent,
    ViewMoreComponent,
    EditCurrentOpeningComponent,
    CareerDetailsComponent,
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    CareerRoutingModule,
    NgMultiSelectDropDownModule,
    CKEditorModule,
  ],
  entryComponents: [ViewMoreComponent, EditCurrentOpeningComponent,CareerDetailsComponent],
})
export class CareerModule {}
