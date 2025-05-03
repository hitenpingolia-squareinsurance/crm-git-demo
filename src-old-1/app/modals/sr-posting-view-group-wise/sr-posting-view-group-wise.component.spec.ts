import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrPostingViewGroupWiseComponent } from './sr-posting-view-group-wise.component';

describe('SrPostingViewGroupWiseComponent', () => {
  let component: SrPostingViewGroupWiseComponent;
  let fixture: ComponentFixture<SrPostingViewGroupWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrPostingViewGroupWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrPostingViewGroupWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
