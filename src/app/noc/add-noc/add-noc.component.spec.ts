import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNocComponent } from './add-noc.component';

describe('AddNocComponent', () => {
  let component: AddNocComponent;
  let fixture: ComponentFixture<AddNocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
