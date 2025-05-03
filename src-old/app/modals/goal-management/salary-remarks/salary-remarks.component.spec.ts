import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryRemarksComponent } from './salary-remarks.component';

describe('SalaryRemarksComponent', () => {
  let component: SalaryRemarksComponent;
  let fixture: ComponentFixture<SalaryRemarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryRemarksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
