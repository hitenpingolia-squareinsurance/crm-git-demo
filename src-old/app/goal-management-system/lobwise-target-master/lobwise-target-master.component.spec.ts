import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobwiseTargetMasterComponent } from './lobwise-target-master.component';

describe('LobwiseTargetMasterComponent', () => {
  let component: LobwiseTargetMasterComponent;
  let fixture: ComponentFixture<LobwiseTargetMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobwiseTargetMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobwiseTargetMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
