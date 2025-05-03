import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaGroupSrComponent } from './pa-group-sr.component';

describe('PaGroupSrComponent', () => {
  let component: PaGroupSrComponent;
  let fixture: ComponentFixture<PaGroupSrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaGroupSrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaGroupSrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
