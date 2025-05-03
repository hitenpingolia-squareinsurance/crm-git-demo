import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryFilesComponent } from './recovery-files.component';

describe('RecoveryFilesComponent', () => {
  let component: RecoveryFilesComponent;
  let fixture: ComponentFixture<RecoveryFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
