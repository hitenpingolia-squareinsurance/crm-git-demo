import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareFilterV2Component } from './square-filter-v2.component';

describe('SquareFilterV2Component', () => {
  let component: SquareFilterV2Component;
  let fixture: ComponentFixture<SquareFilterV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquareFilterV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareFilterV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
