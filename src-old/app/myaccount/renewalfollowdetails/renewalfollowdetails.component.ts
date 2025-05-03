import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { RenewalfollowformComponent } from "../renewalfollowform/renewalfollowform.component";

import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "app-renewalfollowdetails",
  templateUrl: "./renewalfollowdetails.component.html",
  styleUrls: ["./renewalfollowdetails.component.css"],
})
export class RenewalfollowdetailsComponent implements OnInit {
  Loginspection: any = [];
  UserRoleType: any;
  Id: any;
  Status: any;
  

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RenewalfollowdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.Get();

    this.UserRoleType = this.data.Type;
    this.Id = this.data.Id;
    this.Status = this.data.Status;
  }

  Get() {
    const company = this.data.Id;

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "myaccount/RenewalLogFollow?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&SrTableId=" +
          company
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.Loginspection = result["data"];

            // console.log(result);
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          //// console.log(err);
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  ChangeStatusRenewals() {
    var Values = this.Status;
    var Values2 = 2;
    var Id = this.Id;

    if (Values == "") {
    } else {
      const dialogRef = this.dialog.open(RenewalfollowformComponent, {
        width: "60%",
        height: "60%",
        data: { Id: Id, Status: Values, Status2: Values2 },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        setTimeout(() => {
          // this.Reload();
          // console.log("works");
        }, 500);
      });
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
