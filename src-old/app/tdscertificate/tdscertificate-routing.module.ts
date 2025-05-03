import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificateViewComponent } from './certificate-view/certificate-view.component';
import { TdsComponent } from './tds/tds.component';

const routes: Routes = [
  {path:'tds-view/:id', component: CertificateViewComponent},
  {path:'agent-view', component: CertificateViewComponent},
  {path:'tds', component: TdsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TDSCertificateRoutingModule { }
