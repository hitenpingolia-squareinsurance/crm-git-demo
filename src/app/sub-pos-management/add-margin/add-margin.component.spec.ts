import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarginComponent } from './add-margin.component';

describe('AddMarginComponent', () => {
  let component: AddMarginComponent;
  let fixture: ComponentFixture<AddMarginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMarginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
