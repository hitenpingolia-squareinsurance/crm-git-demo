import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadProjectionReportsComponent } from './download-projection-reports.component';

describe('DownloadProjectionReportsComponent', () => {
  let component: DownloadProjectionReportsComponent;
  let fixture: ComponentFixture<DownloadProjectionReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadProjectionReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadProjectionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
