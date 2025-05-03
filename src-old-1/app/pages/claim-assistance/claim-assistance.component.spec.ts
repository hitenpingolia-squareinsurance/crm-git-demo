import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimAssistanceComponent } from './claim-assistance.component';

describe('ClaimAssistanceComponent', () => {
  let component: ClaimAssistanceComponent;
  let fixture: ComponentFixture<ClaimAssistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimAssistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimAssistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
