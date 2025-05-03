import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../providers/api.service";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-claim-details",
  templateUrl: "./claim-details.component.html",
  styleUrls: ["./claim-details.component.css"],
})
export class ClaimDetailsComponent implements OnInit {
  Id: any;
  ClaimData: any;
  row: any;

  constructor(
    public api: ApiService,
    private route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ClaimDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Id = this.data.Id;
  }

  ngOnInit() {
    this.GetClaimDetails(this.Id);
  }

  GetClaimDetails(Id) {
    // console.log(Id);
    const formData = new FormData();
    formData.append("Claim_Id", Id);

    this.api.IsLoading();
    this.api.HttpPostType("Claim/ClaimDetails", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.row = result["Data"];
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }
  CloseModel() {
    this.dialogRef.close();
  }
}
