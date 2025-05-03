import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqViewModelComponent } from './rfq-view-model.component';

describe('RfqViewModelComponent', () => {
  let component: RfqViewModelComponent;
  let fixture: ComponentFixture<RfqViewModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqViewModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqViewModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
