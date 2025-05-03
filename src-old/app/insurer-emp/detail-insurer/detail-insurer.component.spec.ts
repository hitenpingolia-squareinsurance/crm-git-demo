import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInsurerComponent } from './detail-insurer.component';

describe('DetailInsurerComponent', () => {
  let component: DetailInsurerComponent;
  let fixture: ComponentFixture<DetailInsurerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailInsurerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailInsurerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
