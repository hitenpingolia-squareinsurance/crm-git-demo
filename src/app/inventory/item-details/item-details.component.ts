import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../providers/api.service";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-item-details",
  templateUrl: "./item-details.component.html",
  styleUrls: ["./item-details.component.css"],
})
export class ItemDetailsComponent implements OnInit {
  Id: any;
  ClaimData: any;
  row: any;
  ItemDetails: any;
  ItemSpecifications: any;
  ItemStatus: any;
  ResponseData: any;

  constructor(
    public api: ApiService,
    private route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ItemDetailsComponent>,
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
    formData.append("ItemId", Id);

    this.api.IsLoading();
    this.api.HttpPostType("Inventory/ItemDetails", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.ItemDetails = result["ItemDetails"];
          this.ItemSpecifications = result["ItemSpecifications"];
          this.ItemStatus = result["ItemStatus"];
          this.ResponseData = result;
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
