import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeRenewalsTrackComponent } from './life-renewals-track.component';

describe('LifeRenewalsTrackComponent', () => {
  let component: LifeRenewalsTrackComponent;
  let fixture: ComponentFixture<LifeRenewalsTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeRenewalsTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeRenewalsTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
