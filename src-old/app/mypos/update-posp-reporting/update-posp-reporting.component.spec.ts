import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePospReportingComponent } from './update-posp-reporting.component';

describe('UpdatePospReportingComponent', () => {
  let component: UpdatePospReportingComponent;
  let fixture: ComponentFixture<UpdatePospReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePospReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePospReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
