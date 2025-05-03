import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-v2-pay-in-dataview",
  templateUrl: "./v2-pay-in-dataview.component.html",
  styleUrls: ["./v2-pay-in-dataview.component.css"],
})
export class V2PayInDataviewComponent implements OnInit {
  dataAr: any = [];
  searchText: any = "";
  Type: any = "";

  constructor(
    public dialogRef: MatDialogRef<V2PayInDataviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.Type = this.data.Type;
    this.dataAr = this.data.DataAr;
    //   //   //   console.log(this.data.DataAr);
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
