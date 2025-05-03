import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LostRenewalCasesComponent } from './lost-renewal-cases.component';

describe('LostRenewalCasesComponent', () => {
  let component: LostRenewalCasesComponent;
  let fixture: ComponentFixture<LostRenewalCasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LostRenewalCasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LostRenewalCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
