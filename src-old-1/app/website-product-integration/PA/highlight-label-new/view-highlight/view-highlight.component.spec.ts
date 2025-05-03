import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHighlightComponent } from './view-highlight.component';

describe('ViewHighlightComponent', () => {
  let component: ViewHighlightComponent;
  let fixture: ComponentFixture<ViewHighlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHighlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
