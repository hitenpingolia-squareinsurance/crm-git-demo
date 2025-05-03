import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentStatusActionComponent } from './agent-status-action.component';

describe('AgentStatusActionComponent', () => {
  let component: AgentStatusActionComponent;
  let fixture: ComponentFixture<AgentStatusActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentStatusActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentStatusActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
