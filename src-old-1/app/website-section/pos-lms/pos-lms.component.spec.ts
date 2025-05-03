import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosLmsComponent } from './pos-lms.component';

describe('PosLmsComponent', () => {
  let component: PosLmsComponent;
  let fixture: ComponentFixture<PosLmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosLmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosLmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
