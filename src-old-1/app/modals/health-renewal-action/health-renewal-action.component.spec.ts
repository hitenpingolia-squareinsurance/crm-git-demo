import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthRenewalActionComponent } from './health-renewal-action.component';

describe('HealthRenewalActionComponent', () => {
  let component: HealthRenewalActionComponent;
  let fixture: ComponentFixture<HealthRenewalActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthRenewalActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthRenewalActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
