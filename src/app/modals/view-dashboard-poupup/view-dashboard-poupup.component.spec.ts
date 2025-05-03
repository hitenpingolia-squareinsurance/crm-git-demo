import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDashboardPoupupComponent } from './view-dashboard-poupup.component';

describe('ViewDashboardPoupupComponent', () => {
  let component: ViewDashboardPoupupComponent;
  let fixture: ComponentFixture<ViewDashboardPoupupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDashboardPoupupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDashboardPoupupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
