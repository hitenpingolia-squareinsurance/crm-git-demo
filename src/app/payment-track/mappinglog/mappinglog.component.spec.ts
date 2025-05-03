import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappinglogComponent } from './mappinglog.component';

describe('MappinglogComponent', () => {
  let component: MappinglogComponent;
  let fixture: ComponentFixture<MappinglogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappinglogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappinglogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
