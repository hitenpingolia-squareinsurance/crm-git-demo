import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManegerRenewalSectionComponent } from './maneger-renewal-section.component';

describe('ManegerRenewalSectionComponent', () => {
  let component: ManegerRenewalSectionComponent;
  let fixture: ComponentFixture<ManegerRenewalSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManegerRenewalSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManegerRenewalSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
