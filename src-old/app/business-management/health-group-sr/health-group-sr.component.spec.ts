import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthGroupSrComponent } from './health-group-sr.component';

describe('HealthGroupSrComponent', () => {
  let component: HealthGroupSrComponent;
  let fixture: ComponentFixture<HealthGroupSrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthGroupSrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthGroupSrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
