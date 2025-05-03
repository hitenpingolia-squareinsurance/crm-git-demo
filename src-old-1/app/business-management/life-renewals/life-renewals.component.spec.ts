import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeRenewalsComponent } from './life-renewals.component';

describe('LifeRenewalsComponent', () => {
  let component: LifeRenewalsComponent;
  let fixture: ComponentFixture<LifeRenewalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeRenewalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeRenewalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
