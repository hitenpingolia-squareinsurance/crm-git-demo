import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PincodeMasterComponent } from './pincode-master.component';

describe('PincodeMasterComponent', () => {
  let component: PincodeMasterComponent;
  let fixture: ComponentFixture<PincodeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PincodeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PincodeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
