import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHospitalListComponent } from './view-hospital-list.component';

describe('ViewHospitalListComponent', () => {
  let component: ViewHospitalListComponent;
  let fixture: ComponentFixture<ViewHospitalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHospitalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHospitalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
