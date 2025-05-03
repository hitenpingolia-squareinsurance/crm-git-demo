import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectiondetailsdailogComponent } from './inspectiondetailsdailog.component';

describe('InspectiondetailsdailogComponent', () => {
  let component: InspectiondetailsdailogComponent;
  let fixture: ComponentFixture<InspectiondetailsdailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectiondetailsdailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectiondetailsdailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
