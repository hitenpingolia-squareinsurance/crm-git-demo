import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateLetterFormComponent } from './mandate-letter-form.component';

describe('MandateLetterFormComponent', () => {
  let component: MandateLetterFormComponent;
  let fixture: ComponentFixture<MandateLetterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateLetterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateLetterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
