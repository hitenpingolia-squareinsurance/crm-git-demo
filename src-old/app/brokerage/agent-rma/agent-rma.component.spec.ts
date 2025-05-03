import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentRmaComponent } from './agent-rma.component';

describe('AgentRmaComponent', () => {
  let component: AgentRmaComponent;
  let fixture: ComponentFixture<AgentRmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentRmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentRmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
