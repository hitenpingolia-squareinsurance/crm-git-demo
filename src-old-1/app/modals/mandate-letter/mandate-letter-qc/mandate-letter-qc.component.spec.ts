import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateLetterQcComponent } from './mandate-letter-qc.component';

describe('MandateLetterQcComponent', () => {
  let component: MandateLetterQcComponent;
  let fixture: ComponentFixture<MandateLetterQcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateLetterQcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateLetterQcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
