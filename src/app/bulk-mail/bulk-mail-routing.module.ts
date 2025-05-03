import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TeamMailComponent } from "./team-mail/team-mail.component";

const routes: Routes = [{ path: "Square-Team", component: TeamMailComponent },{ path: "My-Team", component: TeamMailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkMailRoutingModule {}
