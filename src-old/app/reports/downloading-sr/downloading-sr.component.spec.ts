import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadingSrComponent } from './downloading-sr.component';

describe('DownloadingSrComponent', () => {
  let component: DownloadingSrComponent;
  let fixture: ComponentFixture<DownloadingSrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadingSrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadingSrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
