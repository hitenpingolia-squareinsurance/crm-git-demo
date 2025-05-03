import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentReportComponent } from './agent-report.component';

describe('AgentReportComponent', () => {
  let component: AgentReportComponent;
  let fixture: ComponentFixture<AgentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
