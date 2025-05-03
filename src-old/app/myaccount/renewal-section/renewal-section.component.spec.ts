import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalSectionComponent } from './renewal-section.component';

describe('RenewalSectionComponent', () => {
  let component: RenewalSectionComponent;
  let fixture: ComponentFixture<RenewalSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
