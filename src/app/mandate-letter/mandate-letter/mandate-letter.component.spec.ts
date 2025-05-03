import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateLetterComponent } from './mandate-letter.component';

describe('MandateLetterComponent', () => {
  let component: MandateLetterComponent;
  let fixture: ComponentFixture<MandateLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
