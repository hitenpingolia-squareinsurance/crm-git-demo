import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { MailFormComponent } from "../mail-form/mail-form.component";
import { TestMailComponent } from "../test-mail/test-mail.component";
@Component({
  selector: "app-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.css"],
})
export class ViewComponent implements OnInit {
  dataar: any;
  valData: any = "";
  toMail: any = "";

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MailFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataar = data.data;
  }

  ngOnInit() {
    document.getElementById("html").innerHTML = this.dataar.MessageBody;
    //   //   //   console.log(this.dataar);
  }

  send(data: any) {
    this.valData = data;
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close({
      Status: this.valData,
      toMail: this.toMail,
    });
  }

  dailog() {
    const dialogRef = this.dialog.open(TestMailComponent, {
      width: "40%",
      height: "60%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.Status == true) {
        this.toMail = result.toMail;
        this.valData = 1;
        this.closeDialog();
      }
    });
  }

  confirmSend(): void {
    const confirmation = confirm("Are you sure you want to send the mail?");
    if (confirmation) {
      this.send(1);
    }
  }
}
