import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthRenewalsTrackComponent } from './health-renewals-track.component';

describe('HealthRenewalsTrackComponent', () => {
  let component: HealthRenewalsTrackComponent;
  let fixture: ComponentFixture<HealthRenewalsTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthRenewalsTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthRenewalsTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
