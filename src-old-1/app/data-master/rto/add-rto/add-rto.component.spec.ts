import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRtoComponent } from './add-rto.component';

describe('AddRtoComponent', () => {
  let component: AddRtoComponent;
  let fixture: ComponentFixture<AddRtoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRtoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
