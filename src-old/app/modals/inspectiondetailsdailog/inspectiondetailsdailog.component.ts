import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-inspectiondetailsdailog",
  templateUrl: "./inspectiondetailsdailog.component.html",
  styleUrls: ["./inspectiondetailsdailog.component.css"],
})
export class InspectiondetailsdailogComponent implements OnInit {
  Loginspection: any = [];
  InspectionData: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<InspectiondetailsdailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.Get();
  }

  Get() {
    const company = this.data.Company;
    const quotation = this.data.Id;

    // // console.log(this.data);

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Globel/Loginspection?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&quote=" +
          quotation +
          "&company=" +
          company
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Loginspection = result["Loginspection"];
            this.InspectionData = result["InspectionData"];

            // console.log(result);
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
