import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSingleContentComponent } from './view-single-content.component';

describe('ViewSingleContentComponent', () => {
  let component: ViewSingleContentComponent;
  let fixture: ComponentFixture<ViewSingleContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSingleContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSingleContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
