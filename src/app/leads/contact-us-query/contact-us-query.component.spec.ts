import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsQueryComponent } from './contact-us-query.component';

describe('ContactUsQueryComponent', () => {
  let component: ContactUsQueryComponent;
  let fixture: ComponentFixture<ContactUsQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactUsQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUsQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
