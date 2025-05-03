import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailInsurerComponent } from './detail-insurer/detail-insurer.component';

const routes: Routes = [
  {path: 'detail', component: DetailInsurerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsurerEmpRoutingModule { }
