import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRequestsComponent } from './claim-requests.component';

describe('ClaimRequestsComponent', () => {
  let component: ClaimRequestsComponent;
  let fixture: ComponentFixture<ClaimRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
