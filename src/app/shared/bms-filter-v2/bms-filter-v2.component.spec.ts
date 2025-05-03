import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BmsFilterV2Component } from './bms-filter-v2.component';

describe('BmsFilterV2Component', () => {
  let component: BmsFilterV2Component;
  let fixture: ComponentFixture<BmsFilterV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BmsFilterV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BmsFilterV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
