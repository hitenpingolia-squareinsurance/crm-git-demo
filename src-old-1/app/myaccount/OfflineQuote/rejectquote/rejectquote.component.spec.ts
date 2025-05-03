import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectquoteComponent } from './rejectquote.component';

describe('RejectquoteComponent', () => {
  let component: RejectquoteComponent;
  let fixture: ComponentFixture<RejectquoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectquoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectquoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
