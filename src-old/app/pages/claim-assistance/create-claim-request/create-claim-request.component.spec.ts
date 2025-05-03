import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClaimRequestComponent } from './create-claim-request.component';

describe('CreateClaimRequestComponent', () => {
  let component: CreateClaimRequestComponent;
  let fixture: ComponentFixture<CreateClaimRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateClaimRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClaimRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
