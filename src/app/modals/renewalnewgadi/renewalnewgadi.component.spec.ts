import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalnewgadiComponent } from './renewalnewgadi.component';

describe('RenewalnewgadiComponent', () => {
  let component: RenewalnewgadiComponent;
  let fixture: ComponentFixture<RenewalnewgadiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalnewgadiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalnewgadiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
