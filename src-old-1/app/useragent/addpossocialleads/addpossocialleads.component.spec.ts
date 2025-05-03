import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpossocialleadsComponent } from './addpossocialleads.component';

describe('AddpossocialleadsComponent', () => {
  let component: AddpossocialleadsComponent;
  let fixture: ComponentFixture<AddpossocialleadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpossocialleadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpossocialleadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
