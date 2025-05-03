import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, ViewChild, Inject, Optional } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "app-sr-rejected",
  templateUrl: "./sr-rejected.component.html",
  styleUrls: ["./sr-rejected.component.css"],
})
export class SrRejectedComponent implements OnInit {
  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  submitRejectRemark: FormGroup;
  isCheck = false;
  remarked: any;
  id: any;

  constructor(
    public dialogRef: MatDialogRef<SrRejectedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.id = this.data.SR_Id;

    this.dropdownSingleSettingsType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.submitRejectRemark = this.formBuilder.group({
      remark: ["", Validators.required],
      inputRemark: ["", Validators.required],
    });

    this.fetchReasonsOfReject();
  }

  fetchReasonsOfReject() {
    this.api.CallBms("../v2/sr/Submit/ReasonOfRejection").then(
      (result) => {
        //   //   //   console.log(result);

        if (result["Status"] === true) {
          this.remarked = result["Data"];
        } else {
          this.api.Toast("Warning", result["Message"]);
        }

        this.api.HideLoading();
      },
      (err) => {
        this.api.HideLoading();
        // this.api.Toast('Warning',result["Message"]);
      }
    );
  }

  SubmitRemark() {
    this.isCheck = true;

    if (this.submitRejectRemark.invalid) {
      return;
    } else {
      var fields = this.submitRejectRemark.value;

      const formData = new FormData();

      var Remark = fields["remark"];
      var inputRemark = fields["inputRemark"];

      if (
        inputRemark == "ok" ||
        inputRemark == "OK" ||
        inputRemark == "okay" ||
        inputRemark == "OKAY"
      ) {
        alert("Please enter vaild Reason/Remark.");
        return;
      }

      formData.append("drop_remark", JSON.stringify(Remark));
      // formData.append('inputRemark',inputRemark);
      formData.append("User_Id", this.api.GetUserData("Code"));
      //formData.append("User_Id", this.api.GetUserId());
      formData.append("SR_Id", this.id);
      formData.append("Remark", inputRemark);
      formData.append("Source", "CRM");

      this.api.IsLoading();
      // this.api.HttpPostTypeBms('../v2/sr/Submit/SubmitRemark', formData).then((result) => {
      this.api.HttpPostTypeBms("../v2/sr/Submit/Reject_SR", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.closeModel();
          } else {
            this.api.Toast("Error", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast("Warning", "Network Error, Please try again ! ");
        }
      );
    }
  }

  get VProduct() {
    return this.submitRejectRemark.controls;
  }

  closeModel() {
    this.dialogRef.close();
  }
}
