import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BmsFilterV3Component } from './bms-filter-v3.component';

describe('BmsFilterV3Component', () => {
  let component: BmsFilterV3Component;
  let fixture: ComponentFixture<BmsFilterV3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BmsFilterV3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BmsFilterV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
