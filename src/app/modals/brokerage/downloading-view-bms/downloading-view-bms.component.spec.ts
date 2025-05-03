import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadingViewBmsComponent } from './downloading-view-bms.component';

describe('DownloadingViewBmsComponent', () => {
  let component: DownloadingViewBmsComponent;
  let fixture: ComponentFixture<DownloadingViewBmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadingViewBmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadingViewBmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
