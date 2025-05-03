import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LostRenewalManagerComponent } from './lost-renewal-manager.component';

describe('LostRenewalManagerComponent', () => {
  let component: LostRenewalManagerComponent;
  let fixture: ComponentFixture<LostRenewalManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LostRenewalManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LostRenewalManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
