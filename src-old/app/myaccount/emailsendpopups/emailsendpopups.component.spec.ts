import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsendpopupsComponent } from './emailsendpopups.component';

describe('EmailsendpopupsComponent', () => {
  let component: EmailsendpopupsComponent;
  let fixture: ComponentFixture<EmailsendpopupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailsendpopupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsendpopupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
