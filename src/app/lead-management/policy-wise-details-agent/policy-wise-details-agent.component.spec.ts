import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyWiseDetailsAgentComponent } from './policy-wise-details-agent.component';

describe('PolicyWiseDetailsAgentComponent', () => {
  let component: PolicyWiseDetailsAgentComponent;
  let fixture: ComponentFixture<PolicyWiseDetailsAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyWiseDetailsAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyWiseDetailsAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
