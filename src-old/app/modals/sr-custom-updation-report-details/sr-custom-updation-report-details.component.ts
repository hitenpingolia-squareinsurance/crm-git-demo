
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { MatDialog } from "@angular/material/dialog";
import { GemsDetailsViewRemarkComponent } from "../gems-details-view-remark/gems-details-view-remark.component";
import { environment } from "src/environments/environment";


@Component({
  selector: 'app-sr-custom-updation-report-details',
  templateUrl: './sr-custom-updation-report-details.component.html',
  styleUrls: ['./sr-custom-updation-report-details.component.css']
})
export class SrCustomUpdationReportDetailsComponent implements OnInit {
  url: any;
  Id: any;
  DataAr: any;





  constructor(
    public dialogRef: MatDialogRef<SrCustomUpdationReportDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public api: ApiService,
    public dialog: MatDialog,
    private http: HttpClient,

  ) {



    this.url = this.data.url;
    this.Id = this.data.Id;




  }

  ngOnInit() {
    this.GetDetails();
  }




  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }



  GetDetails() {

    this.api.IsLoading();

    this.http.get<any>(this.api.additionParmsEnc(environment.apiUrlBmsBase + this.url + "?Id=" + this.Id), this.api.getHeader(environment.apiUrlBmsBase)).subscribe(
      (res: any) => {
        var result = JSON.parse(this.api.decryptText(res.response));

        this.api.HideLoading();
        if (result["Status"] == 1) {
          this.DataAr = result["html"];
        } else {
          this.api.Toast("Warning", result["message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error: " + err.name + " (" + err.statusText + ")"
        );
      }
    );

  }


}
