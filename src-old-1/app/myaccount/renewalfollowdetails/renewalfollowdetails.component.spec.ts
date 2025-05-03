import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalfollowdetailsComponent } from './renewalfollowdetails.component';

describe('RenewalfollowdetailsComponent', () => {
  let component: RenewalfollowdetailsComponent;
  let fixture: ComponentFixture<RenewalfollowdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalfollowdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalfollowdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
