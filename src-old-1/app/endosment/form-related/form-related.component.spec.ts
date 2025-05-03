import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRelatedComponent } from './form-related.component';

describe('FormRelatedComponent', () => {
  let component: FormRelatedComponent;
  let fixture: ComponentFixture<FormRelatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRelatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
