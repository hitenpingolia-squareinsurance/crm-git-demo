import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalnoticeComponent } from './renewalnotice.component';

describe('RenewalnoticeComponent', () => {
  let component: RenewalnoticeComponent;
  let fixture: ComponentFixture<RenewalnoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalnoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalnoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
