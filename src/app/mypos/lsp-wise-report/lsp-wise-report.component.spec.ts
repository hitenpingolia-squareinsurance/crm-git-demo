import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LspWiseReportComponent } from './lsp-wise-report.component';

describe('LspWiseReportComponent', () => {
  let component: LspWiseReportComponent;
  let fixture: ComponentFixture<LspWiseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LspWiseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LspWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
