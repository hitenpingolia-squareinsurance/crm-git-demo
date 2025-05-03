import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeRenewalActionComponent } from './life-renewal-action.component';

describe('LifeRenewalActionComponent', () => {
  let component: LifeRenewalActionComponent;
  let fixture: ComponentFixture<LifeRenewalActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeRenewalActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeRenewalActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
