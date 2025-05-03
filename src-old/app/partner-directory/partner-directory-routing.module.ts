import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnerDirectoryComponent } from './partner-directory/partner-directory.component';


const routes: Routes = [
  { path: 'partner-directory', component: PartnerDirectoryComponent },
  { path: 'partner-directory/:id', component: PartnerDirectoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerDirectoryRoutingModule { }
