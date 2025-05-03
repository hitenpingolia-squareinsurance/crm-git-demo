import { CKEditorModule } from "ckeditor4-angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { MatDialogModule } from "@angular/material/dialog";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { WebsiteSectionRoutingModule } from "./website-section-routing.module";
import { ViewPostersComponent } from "./posters/view-posters/view-posters.component";
import { ViewProductDetailsComponent } from "./product-details/view-product-details/view-product-details.component";
import { ViewWebsiteToolsComponent } from "./tools/view-website-tools/view-website-tools.component";
import { AddWebsiteToolsComponent } from "./tools/add-website-tools/add-website-tools.component";
import { MainBlogComponent } from "./Blogs/main-blog/main-blog.component";
import { ViewBlogComponent } from "./Blogs/view-blog/view-blog.component";
// import { CKEditorModule } from 'ng2-ckeditor';

import { SharedModule } from "../shared/shared.module";
import { GalleyawardsComponent } from "./galleyawards/galleyawards.component";
import { AddMoreComponent } from "./add-more/add-more.component";
import { ViewUrlComponent } from "./url-redirection/view-url/view-url.component";
import { AddUrlComponent } from "./url-redirection/add-url/add-url.component";
import { BikeInsuranceComponent } from "./products/bike-insurance/bike-insurance.component";

import { CarInsuranceComponent } from "./products/car-insurance/car-insurance.component";
import { HealthInsuranceComponent } from "./products/health-insurance/health-insurance.component";
import { LifeInsuranceComponent } from "./products/life-insurance/life-insurance.component";
import { MotorInsuranceComponent } from "./products/motor-insurance/motor-insurance.component";
import { TravelInsuranceComponent } from "./products/travel-insurance/travel-insurance.component";
import { BlockEmailMobileComponent } from "./block-email-mobile/block-email-mobile.component";
import { WorkWishesCreateComponent } from "./work-wishes-create/work-wishes-create.component";
import { ImageCropperModule } from "ngx-image-cropper";

import { DynamicQuoteViewComponent } from "./dynamicproductpage/dynamic-quote-view/dynamic-quote-view.component";
import { AddQuotesComponent } from "./dynamicproductpage/add-quotes/add-quotes.component";
import { ProductImageDynamicComponent } from "./dynamicproductpage/product-image-dynamic/product-image-dynamic.component";
import { AddDynamicValueComponent } from "./dynamicproductpage/add-dynamic-value/add-dynamic-value.component";
import { ViewInsuranceCompanyComponent } from "./dynamicproductpage/view-insurance-company/view-insurance-company.component";
import { AddInsuranceCompanyComponent } from "./dynamicproductpage/add-insurance-company/add-insurance-company.component";
import { BecomePosLeadsComponent } from "./become-pos-leads/become-pos-leads.component";
import { PreInspectionEditpoupComponent } from "./pre-inspection-editpoup/pre-inspection-editpoup.component";
import { PreInspectionModelComponent } from "./pre-inspection-model/pre-inspection-model.component";

import { ViewRatingsComponent } from "./dynamicproductpage/view-ratings/view-ratings.component";
import { AddRatingsComponent } from "./dynamicproductpage/add-ratings/add-ratings.component";
import { PosLmsComponent } from './pos-lms/pos-lms.component';

// Meenu component
import { MotorQuotesLabelComponent } from './motor-quotes-label/motor-quotes-label.component';
import { AddMotorQuotesLabelComponent } from './add-motor-quotes-label/add-motor-quotes-label.component';
import { EditMotorQuotesLabelComponent } from './edit-motor-quotes-label/edit-motor-quotes-label.component';
import { AuthorComponent } from './author/author.component';
import { FAQsComponent } from "./faqs/faqs.component";
import { FAQsVeiwComponent } from "./faqs-veiw/faqs-veiw.component";
import { LanguageReportComponent } from "./language-report/language-report.component";
import { AddLangComponent } from "./language-report/add-lang/add-lang.component";

@NgModule({
  declarations: [
    ViewPostersComponent,
    ViewRatingsComponent,
    AddRatingsComponent,
    BecomePosLeadsComponent,
    WorkWishesCreateComponent,
    AddInsuranceCompanyComponent,
    ViewInsuranceCompanyComponent,
    AddDynamicValueComponent,
    ProductImageDynamicComponent,
    DynamicQuoteViewComponent,
    AddQuotesComponent,
    LifeInsuranceComponent,
    MotorInsuranceComponent,
    TravelInsuranceComponent,
    BikeInsuranceComponent,
    HealthInsuranceComponent,
    CarInsuranceComponent,
    ViewProductDetailsComponent,
    ViewWebsiteToolsComponent,
    AddWebsiteToolsComponent,
    MainBlogComponent,
    MotorQuotesLabelComponent,
    AddMotorQuotesLabelComponent,
    EditMotorQuotesLabelComponent,
    ViewBlogComponent,
    GalleyawardsComponent,
    AddMoreComponent,
    ViewUrlComponent,
    AddUrlComponent,
    BlockEmailMobileComponent,
    PreInspectionEditpoupComponent,
    PreInspectionModelComponent,
    PosLmsComponent,
    AuthorComponent,
    FAQsComponent,
    FAQsVeiwComponent,
    LanguageReportComponent,
    AddLangComponent
  ],
  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDialogModule,
    WebsiteSectionRoutingModule,
    CKEditorModule,
    ImageCropperModule,
  ],
  entryComponents: [
    AddMoreComponent,
    AddUrlComponent,
    PreInspectionEditpoupComponent, AddMotorQuotesLabelComponent,
    EditMotorQuotesLabelComponent,AddLangComponent
  ],
})
export class WebsiteSectionModule {}
