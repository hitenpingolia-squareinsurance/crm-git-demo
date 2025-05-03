import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignLogsComponent } from './campaign-logs.component';

describe('CampaignLogsComponent', () => {
  let component: CampaignLogsComponent;
  let fixture: ComponentFixture<CampaignLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
