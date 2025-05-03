import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCateComponent } from './view-cate.component';

describe('ViewCateComponent', () => {
  let component: ViewCateComponent;
  let fixture: ComponentFixture<ViewCateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
