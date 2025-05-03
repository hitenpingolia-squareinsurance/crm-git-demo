import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRequestComponent } from './vendor-request.component';

describe('VendorRequestComponent', () => {
  let component: VendorRequestComponent;
  let fixture: ComponentFixture<VendorRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
