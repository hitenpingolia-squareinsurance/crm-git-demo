import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { ViewComponent } from "../view/view.component";
import { FormBuilder, Validators } from "@angular/forms";
@Component({
  selector: "app-test-mail",
  templateUrl: "./test-mail.component.html",
  styleUrls: ["./test-mail.component.css"]
})
export class TestMailComponent implements OnInit {
  NewMailSubmit: any;
  toMail: any;
  status: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ViewComponent>
  ) {}

  ngOnInit() {
    this.NewMailSubmit = this.formBuilder.group({
      toMail: [
        "",
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        ]
      ]
    });
  }

  submit() {
    if (this.NewMailSubmit.valid) {
      this.status = true;
      this.toMail = this.NewMailSubmit.get("toMail").value;
      this.closeDialog();
    } else {
      this.status = false;
    }
  }

  closeDialog(): void {
    this.dialogRef.close({
      Status: this.status,
      toMail: this.toMail ? this.toMail : ""
    });
  }
}
