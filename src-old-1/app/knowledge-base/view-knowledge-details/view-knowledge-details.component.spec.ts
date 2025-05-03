import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewKnowledgeDetailsComponent } from './view-knowledge-details.component';

describe('ViewKnowledgeDetailsComponent', () => {
  let component: ViewKnowledgeDetailsComponent;
  let fixture: ComponentFixture<ViewKnowledgeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewKnowledgeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewKnowledgeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
