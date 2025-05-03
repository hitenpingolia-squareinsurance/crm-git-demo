import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrRatingsComponent } from './hr-ratings.component';

describe('HrRatingsComponent', () => {
  let component: HrRatingsComponent;
  let fixture: ComponentFixture<HrRatingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrRatingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
