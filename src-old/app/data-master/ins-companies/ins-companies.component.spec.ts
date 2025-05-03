import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsCompaniesComponent } from './ins-companies.component';

describe('InsCompaniesComponent', () => {
  let component: InsCompaniesComponent;
  let fixture: ComponentFixture<InsCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
