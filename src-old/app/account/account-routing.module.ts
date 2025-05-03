import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { RfqQuaitViewComponent } from "./rfq-quait-view/rfq-quait-view.component";
const routes: Routes = [
  { path: "login/:Type", component: LoginComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "login/:Type/:Id", component: LoginComponent },
  { path: "quotation/view/:Id", component: RfqQuaitViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
