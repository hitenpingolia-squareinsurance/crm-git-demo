import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleBusniessReportsComponent } from './tele-busniess-reports.component';

describe('TeleBusniessReportsComponent', () => {
  let component: TeleBusniessReportsComponent;
  let fixture: ComponentFixture<TeleBusniessReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleBusniessReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleBusniessReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
