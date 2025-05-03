import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalonlinequoteCreationComponent } from './renewalonlinequote-creation.component';

describe('RenewalonlinequoteCreationComponent', () => {
  let component: RenewalonlinequoteCreationComponent;
  let fixture: ComponentFixture<RenewalonlinequoteCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalonlinequoteCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalonlinequoteCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
