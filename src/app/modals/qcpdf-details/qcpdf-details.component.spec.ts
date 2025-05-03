import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcpdfDetailsComponent } from './qcpdf-details.component';

describe('QcpdfDetailsComponent', () => {
  let component: QcpdfDetailsComponent;
  let fixture: ComponentFixture<QcpdfDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcpdfDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcpdfDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
