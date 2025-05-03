import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddMeeturlComponent} from './add-meeturl/add-meeturl.component';
import {DigitalMeetingComponent} from './digital-meeting/digital-meeting.component';

const routes: Routes = [
  {path: 'add-square-meet', component: AddMeeturlComponent},
  {path: 'add-square-meet/:Id', component: AddMeeturlComponent},
  {path: 'square-meet', component: DigitalMeetingComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SquareMeetRoutingModule { }
