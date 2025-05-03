import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelrequestDetailsComponent } from './travelrequest-details.component';

describe('TravelrequestDetailsComponent', () => {
  let component: TravelrequestDetailsComponent;
  let fixture: ComponentFixture<TravelrequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelrequestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelrequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
