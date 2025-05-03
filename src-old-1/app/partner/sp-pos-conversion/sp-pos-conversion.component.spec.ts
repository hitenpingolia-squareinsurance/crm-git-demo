import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpPosConversionComponent } from './sp-pos-conversion.component';

describe('SpPosConversionComponent', () => {
  let component: SpPosConversionComponent;
  let fixture: ComponentFixture<SpPosConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpPosConversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpPosConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
