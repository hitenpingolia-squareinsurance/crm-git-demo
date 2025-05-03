import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMeeturlComponent } from './add-meeturl.component';

describe('AddMeeturlComponent', () => {
  let component: AddMeeturlComponent;
  let fixture: ComponentFixture<AddMeeturlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMeeturlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeeturlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
