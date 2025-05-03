import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAdvisorsComponent } from './my-advisors.component';

describe('MyAdvisorsComponent', () => {
  let component: MyAdvisorsComponent;
  let fixture: ComponentFixture<MyAdvisorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAdvisorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAdvisorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
