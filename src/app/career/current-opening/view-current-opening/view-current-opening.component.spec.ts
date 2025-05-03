import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCurrentOpeningComponent } from './view-current-opening.component';

describe('ViewCurrentOpeningComponent', () => {
  let component: ViewCurrentOpeningComponent;
  let fixture: ComponentFixture<ViewCurrentOpeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCurrentOpeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCurrentOpeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
