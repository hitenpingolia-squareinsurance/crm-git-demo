import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseClaimComponent } from './raise-claim.component';

describe('RaiseClaimComponent', () => {
  let component: RaiseClaimComponent;
  let fixture: ComponentFixture<RaiseClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaiseClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
