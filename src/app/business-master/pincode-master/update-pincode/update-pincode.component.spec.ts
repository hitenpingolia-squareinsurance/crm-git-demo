import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePincodeComponent } from './update-pincode.component';

describe('UpdatePincodeComponent', () => {
  let component: UpdatePincodeComponent;
  let fixture: ComponentFixture<UpdatePincodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePincodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePincodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
