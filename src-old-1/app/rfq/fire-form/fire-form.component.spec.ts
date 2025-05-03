import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireFormComponent } from './fire-form.component';

describe('FireFormComponent', () => {
  let component: FireFormComponent;
  let fixture: ComponentFixture<FireFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
