import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMapModalComponent } from './business-map-modal.component';

describe('BusinessMapModalComponent', () => {
  let component: BusinessMapModalComponent;
  let fixture: ComponentFixture<BusinessMapModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessMapModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessMapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
