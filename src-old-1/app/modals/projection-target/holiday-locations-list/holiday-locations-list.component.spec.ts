import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayLocationsListComponent } from './holiday-locations-list.component';

describe('HolidayLocationsListComponent', () => {
  let component: HolidayLocationsListComponent;
  let fixture: ComponentFixture<HolidayLocationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayLocationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayLocationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
