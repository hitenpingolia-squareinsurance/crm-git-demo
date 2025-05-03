import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakemodelComponent } from './makemodel.component';

describe('MakemodelComponent', () => {
  let component: MakemodelComponent;
  let fixture: ComponentFixture<MakemodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakemodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
