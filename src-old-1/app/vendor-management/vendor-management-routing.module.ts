import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorRequestComponent } from './vendor-request/vendor-request.component';


const routes: Routes = [
  {path : 'vendor-type-view', component:VendorRequestComponent},
  { path: 'vendor-service-view', component: VendorRequestComponent },
  { path: 'vendor-request', component: VendorRequestComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorManagementRoutingModule { }
