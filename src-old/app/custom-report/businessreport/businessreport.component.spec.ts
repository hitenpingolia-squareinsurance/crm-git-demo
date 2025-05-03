import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessreportComponent } from './businessreport.component';

describe('BusinessreportComponent', () => {
  let component: BusinessreportComponent;
  let fixture: ComponentFixture<BusinessreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
