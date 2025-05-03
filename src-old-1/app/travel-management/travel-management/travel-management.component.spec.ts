import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelManagementComponent } from './travel-management.component';

describe('TravelManagementComponent', () => {
  let component: TravelManagementComponent;
  let fixture: ComponentFixture<TravelManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
