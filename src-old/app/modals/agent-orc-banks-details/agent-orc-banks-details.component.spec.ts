import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentOrcBanksDetailsComponent } from './agent-orc-banks-details.component';

describe('AgentOrcBanksDetailsComponent', () => {
  let component: AgentOrcBanksDetailsComponent;
  let fixture: ComponentFixture<AgentOrcBanksDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentOrcBanksDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentOrcBanksDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
