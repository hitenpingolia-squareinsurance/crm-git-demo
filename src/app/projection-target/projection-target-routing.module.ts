import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectionTargetListComponent } from './projection-target-list/projection-target-list.component';
import { HolidaysListComponent } from './holidays-list/holidays-list.component';

const routes: Routes = [
  { path: '', component: ProjectionTargetListComponent },
  { path: 'holidays-list', component: HolidaysListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProjectionTargetRoutingModule { }
