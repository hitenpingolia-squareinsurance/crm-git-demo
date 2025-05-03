import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogTrackFormComponent } from './log-track-form.component';

describe('LogTrackFormComponent', () => {
  let component: LogTrackFormComponent;
  let fixture: ComponentFixture<LogTrackFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogTrackFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogTrackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
