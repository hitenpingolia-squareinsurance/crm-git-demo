import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-details-rm-box",
  templateUrl: "./details-rm-box.component.html",
  styleUrls: ["./details-rm-box.component.css"],
})
export class DetailsRmBoxComponent implements OnInit {
  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<DetailsRmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  RmDetails: any = "";
  ngOnInit(): void {
    this.Get();
  }

  Get() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Globel/GetRmDetails?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.RmDetails = result["Data"];

            //  // console.log(this.RmDetails);
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
