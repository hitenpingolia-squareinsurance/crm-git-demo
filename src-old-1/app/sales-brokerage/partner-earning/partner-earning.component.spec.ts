import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerEarningComponent } from './partner-earning.component';

describe('PartnerEarningComponent', () => {
  let component: PartnerEarningComponent;
  let fixture: ComponentFixture<PartnerEarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerEarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerEarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
