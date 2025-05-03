import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokrageRequestLoaderComponent } from './brokrage-request-loader.component';

describe('BrokrageRequestLoaderComponent', () => {
  let component: BrokrageRequestLoaderComponent;
  let fixture: ComponentFixture<BrokrageRequestLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokrageRequestLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokrageRequestLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
