import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtoMasterComponent } from './rto-master.component';

describe('RtoMasterComponent', () => {
  let component: RtoMasterComponent;
  let fixture: ComponentFixture<RtoMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtoMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtoMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
