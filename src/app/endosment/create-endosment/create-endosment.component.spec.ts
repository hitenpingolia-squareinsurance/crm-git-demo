import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEndosmentComponent } from './create-endosment.component';

describe('CreateEndosmentComponent', () => {
  let component: CreateEndosmentComponent;
  let fixture: ComponentFixture<CreateEndosmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEndosmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEndosmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
