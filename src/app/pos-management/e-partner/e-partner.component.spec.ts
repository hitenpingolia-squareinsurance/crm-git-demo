import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EPartnerComponent } from './e-partner.component';

describe('EPartnerComponent', () => {
  let component: EPartnerComponent;
  let fixture: ComponentFixture<EPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
