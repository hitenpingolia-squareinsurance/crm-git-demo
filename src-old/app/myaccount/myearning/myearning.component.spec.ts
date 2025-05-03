import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyearningComponent } from './myearning.component';

describe('MyearningComponent', () => {
  let component: MyearningComponent;
  let fixture: ComponentFixture<MyearningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyearningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
