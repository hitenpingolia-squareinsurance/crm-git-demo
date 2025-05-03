import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicydetailsComponent } from './policydetails.component';

describe('PolicydetailsComponent', () => {
  let component: PolicydetailsComponent;
  let fixture: ComponentFixture<PolicydetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicydetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
