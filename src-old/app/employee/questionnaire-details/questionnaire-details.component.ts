import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../providers/api.service";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-questionnaire-details",
  templateUrl: "./questionnaire-details.component.html",
  styleUrls: ["./questionnaire-details.component.css"],
})
export class QuestionnaireDetailsComponent implements OnInit {
  Id: any;
  ClaimData: any;
  row: any;

  constructor(
    public api: ApiService,
    private route: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<QuestionnaireDetailsComponent>,
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
    formData.append("Referanceid", Id);

    this.api.IsLoading();
    this.api
      .HttpPostType("/b-crm/Employee/GetViewQuestionaireData", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.row = result["data"];
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
