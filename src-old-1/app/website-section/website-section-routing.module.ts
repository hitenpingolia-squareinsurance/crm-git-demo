import { ViewProductDetailsComponent } from "./product-details/view-product-details/view-product-details.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ViewPostersComponent } from "./posters/view-posters/view-posters.component";
import { ViewWebsiteToolsComponent } from "./tools/view-website-tools/view-website-tools.component";
import { AddWebsiteToolsComponent } from "./tools/add-website-tools/add-website-tools.component";
import { MainBlogComponent } from "./Blogs/main-blog/main-blog.component";
import { ViewBlogComponent } from "./Blogs/view-blog/view-blog.component";
import { GalleyawardsComponent } from "./galleyawards/galleyawards.component";
import { ViewUrlComponent } from "./url-redirection/view-url/view-url.component";
import { CarInsuranceComponent } from "./products/car-insurance/car-insurance.component";
import { HealthInsuranceComponent } from "./products/health-insurance/health-insurance.component";
import { LifeInsuranceComponent } from "./products/life-insurance/life-insurance.component";
import { MotorInsuranceComponent } from "./products/motor-insurance/motor-insurance.component";
import { TravelInsuranceComponent } from "./products/travel-insurance/travel-insurance.component";
import { BikeInsuranceComponent } from "./products/bike-insurance/bike-insurance.component";
import { BlockEmailMobileComponent } from "./block-email-mobile/block-email-mobile.component";
import { WorkWishesCreateComponent } from "./work-wishes-create/work-wishes-create.component";
import { AddDynamicValueComponent } from "./dynamicproductpage/add-dynamic-value/add-dynamic-value.component";
import { AddInsuranceCompanyComponent } from "./dynamicproductpage/add-insurance-company/add-insurance-company.component";
import { AddQuotesComponent } from "./dynamicproductpage/add-quotes/add-quotes.component";
import { DynamicQuoteViewComponent } from "./dynamicproductpage/dynamic-quote-view/dynamic-quote-view.component";
import { ProductImageDynamicComponent } from "./dynamicproductpage/product-image-dynamic/product-image-dynamic.component";
import { ViewInsuranceCompanyComponent } from "./dynamicproductpage/view-insurance-company/view-insurance-company.component";
import { BecomePosLeadsComponent } from "./become-pos-leads/become-pos-leads.component";
import { PreInspectionModelComponent } from "./pre-inspection-model/pre-inspection-model.component";
import { ViewRatingsComponent } from "./dynamicproductpage/view-ratings/view-ratings.component";
import { AddRatingsComponent } from "./dynamicproductpage/add-ratings/add-ratings.component";
import { PosLmsComponent } from "./pos-lms/pos-lms.component";
import { MotorQuotesLabelComponent } from "./motor-quotes-label/motor-quotes-label.component";
import { AuthorComponent } from "./author/author.component";
import { FAQsComponent } from "./faqs/faqs.component";
import { FAQsVeiwComponent } from "./faqs-veiw/faqs-veiw.component";
import {LanguageReportComponent} from "./language-report/language-report.component";
import { AddLangComponent } from "./language-report/add-lang/add-lang.component";

const routes: Routes = [
  { path: "motor-quotes-label", component: MotorQuotesLabelComponent },
  { path: "become_posp_leads", component: BecomePosLeadsComponent },
  { path: "products/view-quotes", component: DynamicQuoteViewComponent },
  { path: "products/add-quotes", component: AddQuotesComponent },
  { path: "products/edit-quotes/:Id", component: AddQuotesComponent },
  { path: "products/view_ratings", component: ViewRatingsComponent },
  { path: "products/add_ratings", component: AddRatingsComponent },
  { path: "products/edit_ratings/:Id", component: AddRatingsComponent },

  {
    path: "products/view_image_product",
    component: ProductImageDynamicComponent,
  },
  { path: "products/add_dynamic_images", component: AddDynamicValueComponent },
  {
    path: "products/edit_dynamic_images/:Id",
    component: AddDynamicValueComponent,
  },
  {
    path: "products/view_insurance_company",
    component: ViewInsuranceCompanyComponent,
  },
  {
    path: "products/add_insurance_company",
    component: AddInsuranceCompanyComponent,
  },
  {
    path: "products/edit_insurance_company/:Id",
    component: AddInsuranceCompanyComponent,
  },
  { path: "View-Wishes", component: WorkWishesCreateComponent },
  { path: "PreInspection", component: PreInspectionModelComponent },
  { path: "View-posters", component: ViewPostersComponent },
  { path: "View-Product-Details", component: ViewProductDetailsComponent },
  { path: "View-tools", component: ViewWebsiteToolsComponent },
  { path: "Add-tools", component: AddWebsiteToolsComponent },
  { path: "Main-Blog", component: MainBlogComponent },
  { path: "View-Blog", component: ViewBlogComponent },
  { path: "Block-Email-Mobile", component: BlockEmailMobileComponent },
  { path: "gallery", component: GalleyawardsComponent },
  { path: "awards", component: GalleyawardsComponent },
  { path: "clients", component: GalleyawardsComponent },
  { path: "testimonials", component: GalleyawardsComponent },
  { path: "pillars", component: GalleyawardsComponent },
  { path: "vaccancy", component: GalleyawardsComponent },
  { path: "url-redirection", component: ViewUrlComponent },
  { path: "products/view-bikeinsurance", component: BikeInsuranceComponent },
  { path: "products/view-carinsurance", component: CarInsuranceComponent },
  {
    path: "products/view-healthinsurance",
    component: HealthInsuranceComponent,
  },
  { path: "products/view-lifeinsurance", component: LifeInsuranceComponent },
  { path: "products/view-motorinsurance", component: MotorInsuranceComponent },
  {
    path: "products/view-travelinsurance",
    component: TravelInsuranceComponent,
  },
  {
    path: "pos-lead",
    component: PosLmsComponent,
  },
  {
    path: "author",
    component: AuthorComponent,
  },

  {path: "FAQs" , component : FAQsComponent},
  {path: "FAQs/:Id" , component : FAQsComponent},
  {path: "FAQs-veiw" , component : FAQsVeiwComponent},
  
{path: "language-report" , component : LanguageReportComponent},
{path: "add-lang" , component : AddLangComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsiteSectionRoutingModule {}
