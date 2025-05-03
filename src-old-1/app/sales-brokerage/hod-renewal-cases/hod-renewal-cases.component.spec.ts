import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HodRenewalCasesComponent } from './hod-renewal-cases.component';

describe('HodRenewalCasesComponent', () => {
  let component: HodRenewalCasesComponent;
  let fixture: ComponentFixture<HodRenewalCasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HodRenewalCasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HodRenewalCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
