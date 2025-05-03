import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VievEmpDocRequestComponent } from './viev-emp-doc-request.component';

describe('VievEmpDocRequestComponent', () => {
  let component: VievEmpDocRequestComponent;
  let fixture: ComponentFixture<VievEmpDocRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VievEmpDocRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VievEmpDocRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
