import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCategorizationComponent } from './pos-categorization.component';

describe('PosCategorizationComponent', () => {
  let component: PosCategorizationComponent;
  let fixture: ComponentFixture<PosCategorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosCategorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosCategorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
