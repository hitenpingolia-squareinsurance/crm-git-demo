import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoStatementComponent } from './po-statement.component';

describe('PoStatementComponent', () => {
  let component: PoStatementComponent;
  let fixture: ComponentFixture<PoStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
