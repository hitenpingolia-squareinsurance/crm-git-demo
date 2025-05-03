import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraRewardFilesComponent } from './extra-reward-files.component';

describe('ExtraRewardFilesComponent', () => {
  let component: ExtraRewardFilesComponent;
  let fixture: ComponentFixture<ExtraRewardFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraRewardFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraRewardFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
