import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightsFormPopupComponent } from './rights-form-popup.component';

describe('RightsFormPopupComponent', () => {
  let component: RightsFormPopupComponent;
  let fixture: ComponentFixture<RightsFormPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightsFormPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightsFormPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
