import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadingViewComponent } from './downloading-view.component';

describe('DownloadingViewComponent', () => {
  let component: DownloadingViewComponent;
  let fixture: ComponentFixture<DownloadingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
