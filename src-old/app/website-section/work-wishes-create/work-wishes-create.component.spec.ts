import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkWishesCreateComponent } from './work-wishes-create.component';

describe('WorkWishesCreateComponent', () => {
  let component: WorkWishesCreateComponent;
  let fixture: ComponentFixture<WorkWishesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkWishesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkWishesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
