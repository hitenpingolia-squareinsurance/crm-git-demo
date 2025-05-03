import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddKnowledgeComponent } from './add-knowledge/add-knowledge.component';
import { ViewKnowledgeBaseComponent } from './view-knowledge-base/view-knowledge-base.component';
import { ViewKnowledgeDetailsComponent } from './view-knowledge-details/view-knowledge-details.component';
import { ViewSingleContentComponent } from './view-single-content/view-single-content.component';


const routes: Routes = [
  { path: "add-knowledge", component: AddKnowledgeComponent },
  { path: "edit-knowledge/:any", component: AddKnowledgeComponent },
  { path: "view-knowledge", component: ViewKnowledgeBaseComponent },
  { path: "view-knowledge-details", component: ViewKnowledgeDetailsComponent },
  { path: "single-knowledge-details/:Id/:Category", component: ViewSingleContentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KnowledgeBaseRoutingModule { }
 