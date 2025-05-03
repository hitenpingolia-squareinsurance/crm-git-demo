import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsrRmReportsComponent } from './dsr-rm-reports.component';

describe('DsrRmReportsComponent', () => {
  let component: DsrRmReportsComponent;
  let fixture: ComponentFixture<DsrRmReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsrRmReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsrRmReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
