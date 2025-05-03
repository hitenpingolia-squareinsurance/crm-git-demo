import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BulkMailComponent } from "./bulk-mail/bulk-mail.component";

const routes: Routes = [{ path: "send-mail", component: BulkMailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkMailSenderRoutingModule {}
