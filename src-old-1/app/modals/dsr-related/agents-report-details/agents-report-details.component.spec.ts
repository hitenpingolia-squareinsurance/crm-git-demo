import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsReportDetailsComponent } from './agents-report-details.component';

describe('AgentsReportDetailsComponent', () => {
  let component: AgentsReportDetailsComponent;
  let fixture: ComponentFixture<AgentsReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentsReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentsReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
