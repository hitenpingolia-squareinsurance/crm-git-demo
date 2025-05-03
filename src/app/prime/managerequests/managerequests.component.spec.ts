import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerequestsComponent } from './managerequests.component';

describe('ManagerequestsComponent', () => {
  let component: ManagerequestsComponent;
  let fixture: ComponentFixture<ManagerequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
