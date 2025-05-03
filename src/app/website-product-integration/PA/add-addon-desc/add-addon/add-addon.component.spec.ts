import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddonComponent } from './add-addon.component';

describe('AddAddonComponent', () => {
  let component: AddAddonComponent;
  let fixture: ComponentFixture<AddAddonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAddonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAddonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
