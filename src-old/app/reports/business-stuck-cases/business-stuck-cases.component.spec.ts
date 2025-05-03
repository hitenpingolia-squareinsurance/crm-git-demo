import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessStuckCasesComponent } from './business-stuck-cases.component';

describe('BusinessStuckCasesComponent', () => {
  let component: BusinessStuckCasesComponent;
  let fixture: ComponentFixture<BusinessStuckCasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessStuckCasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessStuckCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
