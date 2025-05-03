import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetRmDetailsComponent } from './get-rm-details.component';

describe('GetRmDetailsComponent', () => {
  let component: GetRmDetailsComponent;
  let fixture: ComponentFixture<GetRmDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetRmDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetRmDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
