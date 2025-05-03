import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayDashboardComponent } from './today-dashboard.component';

describe('TodayDashboardComponent', () => {
  let component: TodayDashboardComponent;
  let fixture: ComponentFixture<TodayDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodayDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodayDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
