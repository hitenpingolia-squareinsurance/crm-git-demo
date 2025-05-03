import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { BmsapiService } from "../../../providers/bmsapi.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-add-payor",
  templateUrl: "./add-payor.component.html",
  styleUrls: ["./add-payor.component.css"],
})
export class AddPayorComponent implements OnInit {
  modalForm: FormGroup;
  isSubmitted = false;

  Payors: any = [];

  constructor(
    public api: BmsapiService,
    private route: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddPayorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.modalForm = this.formBuilder.group({
      Payor_Name: ["", Validators.required],
      Line_1: [],
      Line_2: [],
      Line_3: [],
      Line_4: [],
      Line_5: [],
      Line_6: [],
      Line_7: [],
      Line_8: [],
    });
  }

  ngOnInit() {
    this.GetDetails();
  }

  //FORM CONTROLS
  get formControls() {
    return this.modalForm.controls;
  }

  AddNewPayor() {
    const dialogRef = this.dialog.open(AddPayorComponent, {
      width: "50%",
      height: "60%",
      //disableClose : true,
      data: { Id: 0 },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }

  //===== GET REJECTION DETAILS =====//
  GetDetails() {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());

    this.api.IsLoading();
    this.api.HttpPostType("../v2/reports/Invoicing/GetPayors", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.Payors = result["Data"];
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
        this.api.HideLoading();
      }
    );
  }

  DeletePayor(Id) {
    if (confirm("Are you sure !") == true) {
      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Id", Id);

      this.api.IsLoading();
      this.api
        .HttpPostType("../v2/reports/Invoicing/DeletePayors", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["Status"] == true) {
              alert(result["Message"]);
              this.GetDetails();
            } else {
              this.api.ErrorMsg(result["Message"]);
            }
          },
          (err) => {
            this.api.ErrorMsg(
              "Network Error, Please try again ! " + err.message
            );
            this.api.HideLoading();
          }
        );
    }
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.modalForm.invalid) {
      return;
    } else {
      var fields = this.modalForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());

      Object.keys(this.modalForm.controls).forEach((key) => {
        formData.append(key, this.modalForm.get(key).value);
      });

      this.api.IsLoading();
      this.api.HttpPostType("../v2/reports/Invoicing/Add_Payor", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            //this.dialogRef.close();
            this.modalForm.reset();
            this.GetDetails();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    }
  }

  //===== CLOSE MODAL =====//
  close() {
    this.dialogRef.close();
  }
}
