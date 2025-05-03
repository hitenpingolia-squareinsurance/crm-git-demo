import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PospReportingViewComponent } from './posp-reporting-view.component';

describe('PospReportingViewComponent', () => {
  let component: PospReportingViewComponent;
  let fixture: ComponentFixture<PospReportingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PospReportingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PospReportingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
