import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelrequestMasterComponent } from './travelrequest-master.component';

describe('TravelrequestMasterComponent', () => {
  let component: TravelrequestMasterComponent;
  let fixture: ComponentFixture<TravelrequestMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelrequestMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelrequestMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
