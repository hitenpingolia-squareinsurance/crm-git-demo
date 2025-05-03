import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCurrentOpeningComponent } from './edit-current-opening.component';

describe('EditCurrentOpeningComponent', () => {
  let component: EditCurrentOpeningComponent;
  let fixture: ComponentFixture<EditCurrentOpeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCurrentOpeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCurrentOpeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
