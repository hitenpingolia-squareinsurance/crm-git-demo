import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentMappingFilterComponent } from './current-mapping-filter.component';

describe('CurrentMappingFilterComponent', () => {
  let component: CurrentMappingFilterComponent;
  let fixture: ComponentFixture<CurrentMappingFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentMappingFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentMappingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
