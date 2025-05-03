import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDataFilterComponent } from './all-data-filter.component';

describe('AllDataFilterComponent', () => {
  let component: AllDataFilterComponent;
  let fixture: ComponentFixture<AllDataFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllDataFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDataFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
