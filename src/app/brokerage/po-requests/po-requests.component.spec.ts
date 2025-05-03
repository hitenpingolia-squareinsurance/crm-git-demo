import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoRequestsComponent } from './po-requests.component';

describe('PoRequestsComponent', () => {
  let component: PoRequestsComponent;
  let fixture: ComponentFixture<PoRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
