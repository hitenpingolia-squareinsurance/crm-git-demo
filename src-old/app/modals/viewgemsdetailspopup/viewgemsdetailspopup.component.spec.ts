import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewgemsdetailspopupComponent } from './viewgemsdetailspopup.component';

describe('ViewgemsdetailspopupComponent', () => {
  let component: ViewgemsdetailspopupComponent;
  let fixture: ComponentFixture<ViewgemsdetailspopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewgemsdetailspopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewgemsdetailspopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
