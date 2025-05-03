import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsementRequestComponent } from './endorsement-request.component';

describe('EndorsementRequestComponent', () => {
  let component: EndorsementRequestComponent;
  let fixture: ComponentFixture<EndorsementRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndorsementRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorsementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
