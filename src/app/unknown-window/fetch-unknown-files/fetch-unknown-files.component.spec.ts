import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchUnknownFilesComponent } from './fetch-unknown-files.component';

describe('FetchUnknownFilesComponent', () => {
  let component: FetchUnknownFilesComponent;
  let fixture: ComponentFixture<FetchUnknownFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchUnknownFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchUnknownFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
