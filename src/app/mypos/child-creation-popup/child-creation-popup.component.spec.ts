import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildCreationPopupComponent } from './child-creation-popup.component';

describe('ChildCreationPopupComponent', () => {
  let component: ChildCreationPopupComponent;
  let fixture: ComponentFixture<ChildCreationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildCreationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildCreationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
