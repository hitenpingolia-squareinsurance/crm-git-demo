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
import { EditLifeRenewalPremiumComponent } from "../../modals/life-renewals/edit-life-renewal-premium/edit-life-renewal-premium.component";

@Component({
  selector: "app-life-renewals-track",
  templateUrl: "./life-renewals-track.component.html",
  styleUrls: ["./life-renewals-track.component.css"],
})
export class LifeRenewalsTrackComponent implements OnInit {
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
    public dialogRef: MatDialogRef<LifeRenewalsTrackComponent>,
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
    formData.append("LOB_Id", "LI");
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("SelectedYear", SelectYear);

    this.api.IsLoading();
    this.api.HttpForSR("post", "Renewal/GetRenewalTrack", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.StepData = result["Data"];
          this.Year_Array = result["Year_Array"];
          this.SelectedYear = result["Selected_Year"];
          this.GetYTDChanks();
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

      var url = environment.apiUrlBms + "/Renewal/GetPaymentReciept";

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

  //===== GET PAYMENT RECIEPT =====//
  GetPaymentReciept(SR_Id: any) {
    const formData = new FormData();

    formData.append("SR_Id", SR_Id);

    this.api.IsLoading();
    this.api.HttpForSR("post", "Renewal/GetPaymentReciept", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.ViewDocument(result["Payment_Reciept"]);
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

  //===== VIEW DOCUMENT =====//
  ViewDocument(name: any) {
    var url = name;
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  //===== UPDATE RENEWAL DATE MODAL =====//
  EditRenewalPremium(row_id: any, renewal_year: any): void {
    const dialogRef = this.dialog.open(EditLifeRenewalPremiumComponent, {
      width: "50%",
      height: "65%",
      data: { row_id: row_id, renewal_year: renewal_year },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
