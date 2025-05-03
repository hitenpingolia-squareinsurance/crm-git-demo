import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddposComponent } from './addpos.component';

describe('AddposComponent', () => {
  let component: AddposComponent;
  let fixture: ComponentFixture<AddposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
