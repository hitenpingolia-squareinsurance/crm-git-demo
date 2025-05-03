import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BmsFilterComponent } from './bms-filter.component';

describe('BmsFilterComponent', () => {
  let component: BmsFilterComponent;
  let fixture: ComponentFixture<BmsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BmsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BmsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
