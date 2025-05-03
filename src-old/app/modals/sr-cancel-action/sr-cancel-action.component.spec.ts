import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrCancelActionComponent } from './sr-cancel-action.component';

describe('SrCancelActionComponent', () => {
  let component: SrCancelActionComponent;
  let fixture: ComponentFixture<SrCancelActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrCancelActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrCancelActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
