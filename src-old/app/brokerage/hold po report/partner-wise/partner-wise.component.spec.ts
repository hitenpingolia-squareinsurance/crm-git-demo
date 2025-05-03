import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerWiseComponent } from './partner-wise.component';

describe('PartnerWiseComponent', () => {
  let component: PartnerWiseComponent;
  let fixture: ComponentFixture<PartnerWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
