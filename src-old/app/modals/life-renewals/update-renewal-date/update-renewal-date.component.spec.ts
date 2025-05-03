import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRenewalDateComponent } from './update-renewal-date.component';

describe('UpdateRenewalDateComponent', () => {
  let component: UpdateRenewalDateComponent;
  let fixture: ComponentFixture<UpdateRenewalDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRenewalDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRenewalDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
