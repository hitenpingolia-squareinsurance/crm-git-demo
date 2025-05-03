import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndosmentFormComponent } from './endosment-form.component';

describe('EndosmentFormComponent', () => {
  let component: EndosmentFormComponent;
  let fixture: ComponentFixture<EndosmentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndosmentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndosmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
