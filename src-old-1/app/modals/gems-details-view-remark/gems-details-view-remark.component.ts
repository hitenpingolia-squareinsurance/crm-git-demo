import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";

@Component({
  selector: "app-gems-details-view-remark",
  templateUrl: "./gems-details-view-remark.component.html",
  styleUrls: ["./gems-details-view-remark.component.css"],
})
export class GemsDetailsViewRemarkComponent implements OnInit {
  Remark: any;
  DataAr: any = [];

  constructor(
    public dialogRef: MatDialogRef<GemsDetailsViewRemarkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public api: ApiService
  ) {
    this.Remark = this.data.Remark;

    // console.log(this.data.Remark);
  }

  ngOnInit() {}
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
