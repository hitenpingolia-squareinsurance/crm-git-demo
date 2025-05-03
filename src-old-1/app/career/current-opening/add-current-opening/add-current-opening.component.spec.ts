import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCurrentOpeningComponent } from './add-current-opening.component';

describe('AddCurrentOpeningComponent', () => {
  let component: AddCurrentOpeningComponent;
  let fixture: ComponentFixture<AddCurrentOpeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCurrentOpeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCurrentOpeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
