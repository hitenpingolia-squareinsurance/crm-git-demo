import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerDirectoryPopupComponent } from './partner-directory-popup.component';

describe('PartnerDirectoryPopupComponent', () => {
  let component: PartnerDirectoryPopupComponent;
  let fixture: ComponentFixture<PartnerDirectoryPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerDirectoryPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerDirectoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
