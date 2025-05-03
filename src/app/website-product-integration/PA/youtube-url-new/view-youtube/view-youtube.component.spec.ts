import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewYoutubeComponent } from './view-youtube.component';

describe('ViewYoutubeComponent', () => {
  let component: ViewYoutubeComponent;
  let fixture: ComponentFixture<ViewYoutubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewYoutubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
