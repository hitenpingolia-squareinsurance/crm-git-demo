import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewKnowledgeBaseComponent } from './view-knowledge-base.component';

describe('ViewKnowledgeBaseComponent', () => {
  let component: ViewKnowledgeBaseComponent;
  let fixture: ComponentFixture<ViewKnowledgeBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewKnowledgeBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewKnowledgeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
