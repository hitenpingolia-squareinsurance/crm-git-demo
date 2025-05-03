import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelInsuranceComponent } from './travel-insurance.component';

describe('TravelInsuranceComponent', () => {
  let component: TravelInsuranceComponent;
  let fixture: ComponentFixture<TravelInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
