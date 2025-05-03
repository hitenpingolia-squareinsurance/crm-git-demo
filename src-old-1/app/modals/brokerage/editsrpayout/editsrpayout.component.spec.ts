import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditsrpayoutComponent } from './editsrpayout.component';

describe('EditsrpayoutComponent', () => {
  let component: EditsrpayoutComponent;
  let fixture: ComponentFixture<EditsrpayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditsrpayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditsrpayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
