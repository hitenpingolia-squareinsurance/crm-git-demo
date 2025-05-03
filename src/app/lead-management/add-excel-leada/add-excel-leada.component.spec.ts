import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExcelLeadaComponent } from './add-excel-leada.component';

describe('AddExcelLeadaComponent', () => {
  let component: AddExcelLeadaComponent;
  let fixture: ComponentFixture<AddExcelLeadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExcelLeadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExcelLeadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
