import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingUpdateDateMasterComponent } from './rating-update-date-master.component';

describe('RatingUpdateDateMasterComponent', () => {
  let component: RatingUpdateDateMasterComponent;
  let fixture: ComponentFixture<RatingUpdateDateMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingUpdateDateMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingUpdateDateMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
