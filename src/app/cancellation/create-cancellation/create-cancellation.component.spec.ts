import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCancellationComponent } from './create-cancellation.component';

describe('CreateCancellationComponent', () => {
  let component: CreateCancellationComponent;
  let fixture: ComponentFixture<CreateCancellationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCancellationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
