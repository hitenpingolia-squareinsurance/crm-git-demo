import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentOrcComponent } from './agent-orc.component';

describe('AgentOrcComponent', () => {
  let component: AgentOrcComponent;
  let fixture: ComponentFixture<AgentOrcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentOrcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentOrcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
