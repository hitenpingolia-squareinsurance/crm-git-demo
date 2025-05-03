import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosactivationreportComponent } from './posactivationreport.component';

describe('PosactivationreportComponent', () => {
  let component: PosactivationreportComponent;
  let fixture: ComponentFixture<PosactivationreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosactivationreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosactivationreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
