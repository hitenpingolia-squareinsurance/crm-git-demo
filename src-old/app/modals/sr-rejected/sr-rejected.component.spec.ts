import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrRejectedComponent } from './sr-rejected.component';

describe('SrRejectedComponent', () => {
  let component: SrRejectedComponent;
  let fixture: ComponentFixture<SrRejectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrRejectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
