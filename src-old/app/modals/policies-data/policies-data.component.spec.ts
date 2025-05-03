import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliciesDataComponent } from './policies-data.component';

describe('PoliciesDataComponent', () => {
  let component: PoliciesDataComponent;
  let fixture: ComponentFixture<PoliciesDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliciesDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliciesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
