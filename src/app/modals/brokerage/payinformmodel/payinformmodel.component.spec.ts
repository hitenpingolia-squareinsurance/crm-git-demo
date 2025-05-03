import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayinformmodelComponent } from './payinformmodel.component';

describe('PayinformmodelComponent', () => {
  let component: PayinformmodelComponent;
  let fixture: ComponentFixture<PayinformmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayinformmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayinformmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
