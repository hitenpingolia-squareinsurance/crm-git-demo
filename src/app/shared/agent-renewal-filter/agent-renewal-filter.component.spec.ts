import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentRenewalFilterComponent } from './agent-renewal-filter.component';

describe('AgentRenewalFilterComponent', () => {
  let component: AgentRenewalFilterComponent;
  let fixture: ComponentFixture<AgentRenewalFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentRenewalFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentRenewalFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
