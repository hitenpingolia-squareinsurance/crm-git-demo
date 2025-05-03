import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallProgressComponent } from './call-progress.component';

describe('CallProgressComponent', () => {
  let component: CallProgressComponent;
  let fixture: ComponentFixture<CallProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
