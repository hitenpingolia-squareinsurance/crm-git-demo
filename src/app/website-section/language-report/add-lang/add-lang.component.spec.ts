import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLangComponent } from './add-lang.component';

describe('AddLangComponent', () => {
  let component: AddLangComponent;
  let fixture: ComponentFixture<AddLangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
