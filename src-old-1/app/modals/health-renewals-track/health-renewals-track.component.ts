import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-health-renewals-track",
  templateUrl: "./health-renewals-track.component.html",
  styleUrls: ["./health-renewals-track.component.css"],
})
export class HealthRenewalsTrackComponent implements OnInit {
  SearchForm: FormGroup;
  isSubmitted = false;
  Id: any;
  ShowAction: any;
  Track_Id: any;
  Lob_Name: any;
  row: any;
  User_Rights: any = [];
  StepData: any = [];
  Step_Id: any;
  Year_Array: any = [];
  SelectedYear: any = [];

  dropdownSettingsSingle: any = {};

  constructor(
    public dialogRef: MatDialogRef<HealthRenewalsTrackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.SearchForm = this.formBuilder.group({
      Year_Name: [""],
    });

    this.dropdownSettingsSingle = {
      singleSelection: true,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
      allowSearchFilter: false,
    };
  }

  ngOnInit() {
    this.Id = this.data.Id;
    this.ShowAction = this.data.ShowAction;
    this.GetSR("", "0");
  }

  SearchBtn() {}
  get FC_6() {
    return this.SearchForm.controls;
  }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  //===== GET SR DETAILS =====//
  GetSR(YearValue: any, Type: any) {
    // console.log(YearValue);
    var SelectYear = "";
    if (Type == "1") {
      SelectYear = YearValue["Id"];
    }

    const formData = new FormData();

    formData.append("Id", this.Id);
    formData.append("LOB_Id", "Health");
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("SelectedYear", SelectYear);

    this.api.IsLoading();
    this.api
      .HttpForSR("post", "HealthRenewal/GetRenewalTrackHealth", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.StepData = result["Data"];
            this.Year_Array = result["Year_Array"];
            this.SelectedYear = result["Selected_Year"];
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast("Warning", err.message);
        }
      );
  }

  //===== GET YTD DATA IN CHUNKS =====//
  async GetYTDChanks() {
    for (let i = 0; i < this.StepData.length; i++) {
      var SR_Id = this.StepData[i]["New_SR_Id"];

      const formData = new FormData();
      formData.append("SR_Id", SR_Id);

      var url = environment.apiUrlBms + "/HealthRenewal/GetPaymentReceipt";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));
          //// console.log(data.Agent_Id);
          this.StepData[i]["Full_SR_No"] = data.Full_SR_No;
          this.StepData[i]["Payment_Reciept"] = data.Payment_Reciept;
        });
    }
  }

  //===== VIEW DOCUMENT =====//
  ViewDocument(name: any) {
    var url = name;
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
}
