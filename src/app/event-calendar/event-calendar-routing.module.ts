import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventViewComponent } from './event-view/event-view.component';
import { EventsComponent } from './events/events.component';


const routes: Routes = [
  {path:'view', component: EventViewComponent},
  {path:'manager', component: EventsComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventCalendarRoutingModule { }
