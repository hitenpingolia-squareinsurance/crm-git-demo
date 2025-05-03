import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeotagComponent } from './geotag.component';

describe('GeotagComponent', () => {
  let component: GeotagComponent;
  let fixture: ComponentFixture<GeotagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeotagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeotagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
