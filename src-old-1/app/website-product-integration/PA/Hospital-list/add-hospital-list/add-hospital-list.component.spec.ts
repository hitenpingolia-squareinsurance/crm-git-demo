import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHospitalListComponent } from './add-hospital-list.component';

describe('AddHospitalListComponent', () => {
  let component: AddHospitalListComponent;
  let fixture: ComponentFixture<AddHospitalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHospitalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHospitalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
