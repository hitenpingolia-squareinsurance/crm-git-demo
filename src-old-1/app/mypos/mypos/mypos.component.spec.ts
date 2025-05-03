import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyposComponent } from './mypos.component';

describe('MyposComponent', () => {
  let component: MyposComponent;
  let fixture: ComponentFixture<MyposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
