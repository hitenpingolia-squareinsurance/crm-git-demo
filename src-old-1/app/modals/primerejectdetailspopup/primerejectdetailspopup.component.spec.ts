import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimerejectdetailspopupComponent } from './primerejectdetailspopup.component';

describe('PrimerejectdetailspopupComponent', () => {
  let component: PrimerejectdetailspopupComponent;
  let fixture: ComponentFixture<PrimerejectdetailspopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimerejectdetailspopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimerejectdetailspopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
