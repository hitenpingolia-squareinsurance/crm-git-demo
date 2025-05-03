import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCertificateComponent } from './pos-certificate.component';

describe('PosCertificateComponent', () => {
  let component: PosCertificateComponent;
  let fixture: ComponentFixture<PosCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
