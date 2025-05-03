import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddprimerequestpopupComponent } from './addprimerequestpopup.component';

describe('AddprimerequestpopupComponent', () => {
  let component: AddprimerequestpopupComponent;
  let fixture: ComponentFixture<AddprimerequestpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddprimerequestpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddprimerequestpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
