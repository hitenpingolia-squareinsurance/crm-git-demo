import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqFormCoverageComponent } from './rfq-form-coverage.component';

describe('RfqFormCoverageComponent', () => {
  let component: RfqFormCoverageComponent;
  let fixture: ComponentFixture<RfqFormCoverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqFormCoverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqFormCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
