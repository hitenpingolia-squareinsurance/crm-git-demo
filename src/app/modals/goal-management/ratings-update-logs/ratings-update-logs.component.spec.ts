import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingsUpdateLogsComponent } from './ratings-update-logs.component';

describe('RatingsUpdateLogsComponent', () => {
  let component: RatingsUpdateLogsComponent;
  let fixture: ComponentFixture<RatingsUpdateLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingsUpdateLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingsUpdateLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
