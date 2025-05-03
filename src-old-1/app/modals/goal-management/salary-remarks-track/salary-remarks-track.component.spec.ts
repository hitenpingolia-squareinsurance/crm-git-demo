import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryRemarksTrackComponent } from './salary-remarks-track.component';

describe('SalaryRemarksTrackComponent', () => {
  let component: SalaryRemarksTrackComponent;
  let fixture: ComponentFixture<SalaryRemarksTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryRemarksTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryRemarksTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
