import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingsCriteriaMasterComponent } from './ratings-criteria-master.component';

describe('RatingsCriteriaMasterComponent', () => {
  let component: RatingsCriteriaMasterComponent;
  let fixture: ComponentFixture<RatingsCriteriaMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingsCriteriaMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingsCriteriaMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
