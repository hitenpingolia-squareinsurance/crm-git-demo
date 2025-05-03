import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleComponentComponent } from './eligible-component.component';

describe('EligibleComponentComponent', () => {
  let component: EligibleComponentComponent;
  let fixture: ComponentFixture<EligibleComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EligibleComponentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibleComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
