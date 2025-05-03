import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInsurerComponent } from './add-insurer.component';

describe('AddInsurerComponent', () => {
  let component: AddInsurerComponent;
  let fixture: ComponentFixture<AddInsurerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInsurerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInsurerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
