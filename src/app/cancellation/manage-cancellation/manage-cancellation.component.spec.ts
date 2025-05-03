import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCancellationComponent } from './manage-cancellation.component';

describe('ManageCancellationComponent', () => {
  let component: ManageCancellationComponent;
  let fixture: ComponentFixture<ManageCancellationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCancellationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
