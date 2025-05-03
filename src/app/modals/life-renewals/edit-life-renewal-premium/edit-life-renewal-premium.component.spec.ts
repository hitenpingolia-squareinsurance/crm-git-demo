import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLifeRenewalPremiumComponent } from './edit-life-renewal-premium.component';

describe('EditLifeRenewalPremiumComponent', () => {
  let component: EditLifeRenewalPremiumComponent;
  let fixture: ComponentFixture<EditLifeRenewalPremiumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLifeRenewalPremiumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLifeRenewalPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
