import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementSingleComponent } from './statement-single.component';

describe('StatementSingleComponent', () => {
  let component: StatementSingleComponent;
  let fixture: ComponentFixture<StatementSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
