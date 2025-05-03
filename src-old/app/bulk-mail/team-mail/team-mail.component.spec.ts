import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TeamMailComponent } from "./team-mail.component";

describe("TeamMailComponent", () => {
  let component: TeamMailComponent;
  let fixture: ComponentFixture<TeamMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TeamMailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
