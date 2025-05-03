import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareFilterComponent } from './square-filter.component';

describe('SquareFilterComponent', () => {
  let component: SquareFilterComponent;
  let fixture: ComponentFixture<SquareFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquareFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
