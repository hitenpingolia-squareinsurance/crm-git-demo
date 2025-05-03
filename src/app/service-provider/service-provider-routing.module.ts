import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceproviderComponent } from './serviceprovider/serviceprovider.component';

const routes: Routes = [
  { path: 'service-provider', component: ServiceproviderComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceProviderRoutingModule { }
