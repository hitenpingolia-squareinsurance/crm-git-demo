import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GemsDetailsViewRemarkComponent } from './gems-details-view-remark.component';

describe('GemsDetailsViewRemarkComponent', () => {
  let component: GemsDetailsViewRemarkComponent;
  let fixture: ComponentFixture<GemsDetailsViewRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GemsDetailsViewRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GemsDetailsViewRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
