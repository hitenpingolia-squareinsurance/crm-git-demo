import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PospRightsComponent } from './posp-rights.component';

describe('PospRightsComponent', () => {
  let component: PospRightsComponent;
  let fixture: ComponentFixture<PospRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PospRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PospRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
