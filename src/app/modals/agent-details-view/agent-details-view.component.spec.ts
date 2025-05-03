import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDetailsViewComponent } from './agent-details-view.component';

describe('AgentDetailsViewComponent', () => {
  let component: AgentDetailsViewComponent;
  let fixture: ComponentFixture<AgentDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
