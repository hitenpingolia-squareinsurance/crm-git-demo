import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyMessageComponent } from './company-message.component';

describe('CompanyMessageComponent', () => {
  let component: CompanyMessageComponent;
  let fixture: ComponentFixture<CompanyMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
