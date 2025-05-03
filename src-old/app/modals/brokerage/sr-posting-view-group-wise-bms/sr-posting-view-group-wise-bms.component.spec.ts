import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrPostingViewGroupWiseBmsComponent } from './sr-posting-view-group-wise-bms.component';

describe('SrPostingViewGroupWiseBmsComponent', () => {
  let component: SrPostingViewGroupWiseBmsComponent;
  let fixture: ComponentFixture<SrPostingViewGroupWiseBmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrPostingViewGroupWiseBmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrPostingViewGroupWiseBmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
