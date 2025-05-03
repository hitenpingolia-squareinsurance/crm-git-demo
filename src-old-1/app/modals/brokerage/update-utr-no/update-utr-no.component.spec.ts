import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUtrNoComponent } from './update-utr-no.component';

describe('UpdateUtrNoComponent', () => {
  let component: UpdateUtrNoComponent;
  let fixture: ComponentFixture<UpdateUtrNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateUtrNoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUtrNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
