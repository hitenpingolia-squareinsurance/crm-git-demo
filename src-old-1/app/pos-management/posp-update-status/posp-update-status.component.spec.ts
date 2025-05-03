import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PospUpdateStatusComponent } from './posp-update-status.component';

describe('PospUpdateStatusComponent', () => {
  let component: PospUpdateStatusComponent;
  let fixture: ComponentFixture<PospUpdateStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PospUpdateStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PospUpdateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
