import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LostRenewalManagerOldComponent } from './lost-renewal-manager-old.component';

describe('LostRenewalManagerOldComponent', () => {
  let component: LostRenewalManagerOldComponent;
  let fixture: ComponentFixture<LostRenewalManagerOldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LostRenewalManagerOldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LostRenewalManagerOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
