import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubInsCompaniesComponent } from './sub-ins-companies.component';

describe('SubInsCompaniesComponent', () => {
  let component: SubInsCompaniesComponent;
  let fixture: ComponentFixture<SubInsCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubInsCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubInsCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
