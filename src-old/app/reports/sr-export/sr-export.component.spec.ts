import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrExportComponent } from './sr-export.component';

describe('SrExportComponent', () => {
  let component: SrExportComponent;
  let fixture: ComponentFixture<SrExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
