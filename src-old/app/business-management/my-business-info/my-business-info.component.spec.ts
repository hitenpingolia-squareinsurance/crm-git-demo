import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBusinessInfoComponent } from './my-business-info.component';

describe('MyBusinessInfoComponent', () => {
  let component: MyBusinessInfoComponent;
  let fixture: ComponentFixture<MyBusinessInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBusinessInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBusinessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
