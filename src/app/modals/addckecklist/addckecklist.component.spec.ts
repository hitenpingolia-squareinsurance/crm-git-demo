import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddckecklistComponent } from './addckecklist.component';

describe('AddckecklistComponent', () => {
  let component: AddckecklistComponent;
  let fixture: ComponentFixture<AddckecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddckecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddckecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
