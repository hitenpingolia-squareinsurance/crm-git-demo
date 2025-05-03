import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreComponent } from './add-more.component';

describe('AddMoreComponent', () => {
  let component: AddMoreComponent;
  let fixture: ComponentFixture<AddMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
