import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KraMasterComponent } from './kra-master.component';

describe('KraMasterComponent', () => {
  let component: KraMasterComponent;
  let fixture: ComponentFixture<KraMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KraMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KraMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
