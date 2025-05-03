import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementActiveInactiveComponent } from './agreement-active-inactive.component';

describe('AgreementActiveInactiveComponent', () => {
  let component: AgreementActiveInactiveComponent;
  let fixture: ComponentFixture<AgreementActiveInactiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgreementActiveInactiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementActiveInactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
