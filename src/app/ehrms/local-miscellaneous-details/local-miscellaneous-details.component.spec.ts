import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalMiscellaneousDetailsComponent } from './local-miscellaneous-details.component';

describe('LocalMiscellaneousDetailsComponent', () => {
  let component: LocalMiscellaneousDetailsComponent;
  let fixture: ComponentFixture<LocalMiscellaneousDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalMiscellaneousDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalMiscellaneousDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
