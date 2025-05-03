import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalMiscellaneousClaimComponent } from './local-miscellaneous-claim.component';

describe('LocalMiscellaneousClaimComponent', () => {
  let component: LocalMiscellaneousClaimComponent;
  let fixture: ComponentFixture<LocalMiscellaneousClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalMiscellaneousClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalMiscellaneousClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
