import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GemsDetailsViewComponent } from './gems-details-view.component';

describe('GemsDetailsViewComponent', () => {
  let component: GemsDetailsViewComponent;
  let fixture: ComponentFixture<GemsDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GemsDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GemsDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
