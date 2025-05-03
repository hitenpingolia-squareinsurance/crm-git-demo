import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssestComponent } from './create-assest.component';

describe('CreateAssestComponent', () => {
  let component: CreateAssestComponent;
  let fixture: ComponentFixture<CreateAssestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAssestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
