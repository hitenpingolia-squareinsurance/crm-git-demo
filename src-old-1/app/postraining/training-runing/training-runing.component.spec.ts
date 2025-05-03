import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingRuningComponent } from './training-runing.component';

describe('TrainingRuningComponent', () => {
  let component: TrainingRuningComponent;
  let fixture: ComponentFixture<TrainingRuningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingRuningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingRuningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
