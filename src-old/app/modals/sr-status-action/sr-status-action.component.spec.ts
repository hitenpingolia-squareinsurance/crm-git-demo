import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrStatusActionComponent } from './sr-status-action.component';

describe('SrStatusActionComponent', () => {
  let component: SrStatusActionComponent;
  let fixture: ComponentFixture<SrStatusActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrStatusActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrStatusActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
