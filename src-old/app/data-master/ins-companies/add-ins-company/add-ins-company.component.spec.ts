import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInsCompanyComponent } from './add-ins-company.component';

describe('AddInsCompanyComponent', () => {
  let component: AddInsCompanyComponent;
  let fixture: ComponentFixture<AddInsCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInsCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInsCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
