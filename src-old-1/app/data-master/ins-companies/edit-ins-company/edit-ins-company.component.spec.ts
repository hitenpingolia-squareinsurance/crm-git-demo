import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInsCompanyComponent } from './edit-ins-company.component';

describe('EditInsCompanyComponent', () => {
  let component: EditInsCompanyComponent;
  let fixture: ComponentFixture<EditInsCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInsCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInsCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
