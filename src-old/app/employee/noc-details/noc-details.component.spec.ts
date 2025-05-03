import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NocDetailsComponent } from './noc-details.component';

describe('NocDetailsComponent', () => {
  let component: NocDetailsComponent;
  let fixture: ComponentFixture<NocDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NocDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NocDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
