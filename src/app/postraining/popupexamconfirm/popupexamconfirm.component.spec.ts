import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupexamconfirmComponent } from './popupexamconfirm.component';

describe('PopupexamconfirmComponent', () => {
  let component: PopupexamconfirmComponent;
  let fixture: ComponentFixture<PopupexamconfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupexamconfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupexamconfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
