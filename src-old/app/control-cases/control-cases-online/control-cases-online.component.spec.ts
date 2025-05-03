import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCasesOnlineComponent } from './control-cases-online.component';

describe('ControlCasesOnlineComponent', () => {
  let component: ControlCasesOnlineComponent;
  let fixture: ComponentFixture<ControlCasesOnlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlCasesOnlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCasesOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
