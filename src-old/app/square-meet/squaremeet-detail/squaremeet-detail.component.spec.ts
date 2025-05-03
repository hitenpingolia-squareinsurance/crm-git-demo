import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquaremeetDetailComponent } from './squaremeet-detail.component';

describe('SquaremeetDetailComponent', () => {
  let component: SquaremeetDetailComponent;
  let fixture: ComponentFixture<SquaremeetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquaremeetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquaremeetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
