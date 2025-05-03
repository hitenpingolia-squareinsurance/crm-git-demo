import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqGeneratListComponent } from './rfq-generat-list.component';

describe('RfqGeneratListComponent', () => {
  let component: RfqGeneratListComponent;
  let fixture: ComponentFixture<RfqGeneratListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqGeneratListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqGeneratListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
