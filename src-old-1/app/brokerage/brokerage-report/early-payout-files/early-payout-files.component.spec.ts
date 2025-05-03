import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyPayoutFilesComponent } from './early-payout-files.component';

describe('EarlyPayoutFilesComponent', () => {
  let component: EarlyPayoutFilesComponent;
  let fixture: ComponentFixture<EarlyPayoutFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarlyPayoutFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlyPayoutFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
