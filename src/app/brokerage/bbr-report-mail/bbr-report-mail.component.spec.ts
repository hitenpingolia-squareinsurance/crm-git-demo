import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BbrReportMailComponent } from './bbr-report-mail.component';

describe('BbrReportMailComponent', () => {
  let component: BbrReportMailComponent;
  let fixture: ComponentFixture<BbrReportMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BbrReportMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BbrReportMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
