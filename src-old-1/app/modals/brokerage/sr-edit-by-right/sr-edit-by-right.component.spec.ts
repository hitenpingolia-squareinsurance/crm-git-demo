import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrEditByRightComponent } from './sr-edit-by-right.component';

describe('SrEditByRightComponent', () => {
  let component: SrEditByRightComponent;
  let fixture: ComponentFixture<SrEditByRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrEditByRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrEditByRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
