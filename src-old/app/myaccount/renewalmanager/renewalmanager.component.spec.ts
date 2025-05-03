import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalmanagerComponent } from './renewalmanager.component';

describe('RenewalmanagerComponent', () => {
  let component: RenewalmanagerComponent;
  let fixture: ComponentFixture<RenewalmanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalmanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
