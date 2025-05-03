import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GivenTargetMasterComponent } from './given-target-master.component';

describe('GivenTargetMasterComponent', () => {
  let component: GivenTargetMasterComponent;
  let fixture: ComponentFixture<GivenTargetMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GivenTargetMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GivenTargetMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
