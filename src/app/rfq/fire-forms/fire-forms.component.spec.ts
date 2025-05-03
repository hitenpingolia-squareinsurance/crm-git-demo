import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireFormsComponent } from './fire-forms.component';

describe('FireFormsComponent', () => {
  let component: FireFormsComponent;
  let fixture: ComponentFixture<FireFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
