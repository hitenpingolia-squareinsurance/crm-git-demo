import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabReportsComponent } from './slab-reports.component';

describe('SlabReportsComponent', () => {
  let component: SlabReportsComponent;
  let fixture: ComponentFixture<SlabReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlabReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlabReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
