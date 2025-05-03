import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentRenewalDetailsComponent } from './agent-renewal-details.component';

describe('AgentRenewalDetailsComponent', () => {
  let component: AgentRenewalDetailsComponent;
  let fixture: ComponentFixture<AgentRenewalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentRenewalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentRenewalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
