import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthLangingPageComponent } from './health-langing-page.component';

describe('HealthLangingPageComponent', () => {
  let component: HealthLangingPageComponent;
  let fixture: ComponentFixture<HealthLangingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthLangingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthLangingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
