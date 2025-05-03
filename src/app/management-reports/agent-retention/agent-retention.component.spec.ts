import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentRetentionComponent } from './agent-retention.component';

describe('AgentRetentionComponent', () => {
  let component: AgentRetentionComponent;
  let fixture: ComponentFixture<AgentRetentionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentRetentionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentRetentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
