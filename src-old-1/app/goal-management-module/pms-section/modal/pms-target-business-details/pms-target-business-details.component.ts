import { Component, OnInit, Inject } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ApiService } from "../../../../providers/api.service";
import { environment } from "../../../../../environments/environment";

import { Router } from "@angular/router";

@Component({
  selector: "app-pms-target-business-details",
  templateUrl: "./pms-target-business-details.component.html",
  styleUrls: ["./pms-target-business-details.component.css"],
})
export class PmsTargetBusinessDetailsComponent implements OnInit {
  SearchForm: FormGroup;
  isSubmitted = false;
  Id: any;
  row: any;
  MainIndex: any = 0;
  User_Rights: any = [];
  ShowLoader2: any = "Yes";

  datas: any = [];
  AllocatedData: any = [];

  PosData: any = [];
  AllocatedPosData: any = [];

  Profile_Name: any;
  Is_Sales: any;
  UrlSegment: any;
  Year_Array: any = [];
  SelectedYear: any = [];
  ProfileLobsArray: string[];
  AllocatedLobsArray: string[];
  BelowArrays: string[];
  Is_Edit: any = "";

  AllocatedPosTotal: any = 0;
  AllocatedPosYTD: any = 0;
  AllocatedPosYTDPercent: any = 0;

  dropdownSettingsSingle: any = {};
  Is_Edit_RM: any;
  Url: string;

  ActivePosTotal: any;
  ActivePosYTD: any;
  ActivePosYTDPercent: any;
  TotalActiveTarget: any;
  VerticalId: any;
  Is_Refresh: any = "No";
  Sequence: any = 0;
  DOJ: any = "";
  financial_year: any = "";
  Coreline: any = "Motor";
  ShowCoreLine: any = "";

  CompleteTarget: any;
  CompleteTargetStr: any;
  TotalActualYTD: any;
  TotalActualYTDStr: any;
  TotalActualYTDPercent: any;
  TotalWeightageYTD: any;
  TotalWeightageYTDStr: any;
  TotalWeightageYTDPercent: any;

  MotorTotalTarget: any;
  MotorTotalTargetStr: any;
  MotorActualYTD: any;
  MotorActualYTDStr: any;
  MotorActualYTDPercent: any;
  NonMotorTotalTarget: any;
  NonMotorTotalTargetStr: any;
  NonMotorActualYTD: any;
  NonMotorActualYTDStr: any;
  NonMotorActualYTDPercent: any;
  HealthRetailTotalTarget: any;
  HealthRetailTotalTargetStr: any;
  HealthRetailActualYTD: any;
  HealthRetailActualYTDStr: any;
  HealthRetailActualYTDPercent: any;
  HealthGroupTotalTarget: any;
  HealthGroupTotalTargetStr: any;
  HealthGroupActualYTD: any;
  HealthGroupActualYTDStr: any;
  HealthGroupActualYTDPercent: any;
  LifeRetailTotalTarget: any;
  LifeRetailTotalTargetStr: any;
  LifeRetailActualYTD: any;
  LifeRetailActualYTDStr: any;
  LifeRetailActualYTDPercent: any;
  LifeGroupTotalTarget: any;
  LifeGroupTotalTargetStr: any;
  LifeGroupActualYTD: any;
  LifeGroupActualYTDStr: any;
  LifeGroupActualYTDPercent: any;
  OthersTotalTarget: any;
  OthersTotalTargetStr: any;
  OthersActualYTD: any;
  OthersActualYTDStr: any;
  OthersActualYTDPercent: any;

  MotorWeightageYTD: any;
  MotorWeightageYTDStr: any;
  MotorWeightageYTDPercent: any;
  NonMotorWeightageYTD: any;
  NonMotorWeightageYTDStr: any;
  NonMotorWeightageYTDPercent: any;
  HealthRetailWeightageYTD: any;
  HealthRetailWeightageYTDStr: any;
  HealthRetailWeightageYTDPercent: any;
  HealthGroupWeightageYTD: any;
  HealthGroupWeightageYTDStr: any;
  HealthGroupWeightageYTDPercent: any;
  LifeRetailWeightageYTD: any;
  LifeRetailWeightageYTDStr: any;
  LifeRetailWeightageYTDPercent: any;
  LifeGroupWeightageYTD: any;
  LifeGroupWeightageYTDStr: any;
  LifeGroupWeightageYTDPercent: any;
  OthersWeightageYTD: any;
  OthersWeightageYTDStr: any;
  OthersWeightageYTDPercent: any;

  constructor(
    public dialogRef: MatDialogRef<PmsTargetBusinessDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    public dialog: MatDialog,
    public api: ApiService,
    private router: Router,
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
    this.Profile_Name = this.data.Profile_Name;

    if (this.data.VerticalId == "") {
      this.VerticalId = "";
    } else {
      this.VerticalId = this.data.VerticalId[0]["Id"];
    }

    this.Is_Sales = this.data.Is_Sales;
    this.UrlSegment = this.data.UrlSegment;
    this.Sequence = this.data.Sequence;
    this.DOJ = this.data.DOJ;
    this.financial_year = this.data.financial_year;
    this.Coreline = this.data.Coreline;

    if (this.Id == 43) {
      this.Url = "GetAllEmployeeTargetsData";
    } else {
      this.Url = "GetSelfTargetsData";
    }

    this.GetLobArray();
    this.GetEmployeeAllocatedBusinessTarget();
    this.GetAllocatedPosTarget();
  }

  get FC_6() {
    return this.SearchForm.controls;
  }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
      Is_Refresh: this.Is_Refresh,
    });
  }

  //===== GET EMPLOYEE PROFILE BUSINESS TARGET =====//
  GetLobArray() {
    const formData = new FormData();

    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("UrlSegment", this.UrlSegment);
    formData.append("Portal", "CRM");
    formData.append("EmployeeId", this.Id);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms("goal-management-system/GridData/GetLobArray", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.ProfileLobsArray = result["ProfileLobArray"];
            this.AllocatedLobsArray = result["AllocatedLobArray"];
            this.BelowArrays = result["BelowArrays"];
            this.Coreline = result["Coreline"];
            this.ShowCoreLine = result["Coreline"];
            //   //   //   console.log(this.AllocatedLobsArray);
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

  //===== GET EMPLOYEE ALLOCATED BUSINESS TARGET =====//
  GetEmployeeAllocatedBusinessTarget() {
    const formData = new FormData();

    formData.append("Id", this.Id);
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("UrlSegment", this.UrlSegment);
    formData.append("Profile_Name", this.Profile_Name);
    formData.append("Is_Sales", this.Is_Sales);
    formData.append("Portal", "CRM");
    formData.append("VerticalId", this.VerticalId);
    formData.append("Coreline", this.Coreline);
    formData.append("financial_year", this.financial_year);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "goal-management-system/pms/BusinessTargets/" + this.Url,
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.AllocatedData = result["TotalTarget"];

            this.Is_Edit = result["Is_Edit"];
            this.Is_Edit_RM = result["Is_Edit_RM"];

            this.CompleteTarget = result["CompleteTarget"];
            this.CompleteTargetStr = result["CompleteTargetStr"];
            this.TotalActualYTD = result["TotalActualYTD"];
            this.TotalActualYTDStr = result["TotalActualYTDStr"];
            this.TotalActualYTDPercent = result["TotalActualYTDPercent"];
            this.TotalWeightageYTD = result["TotalWeightageYTD"];
            this.TotalWeightageYTDStr = result["TotalWeightageYTDStr"];
            this.TotalWeightageYTDPercent = result["TotalWeightageYTDPercent"];

            this.MotorTotalTarget = result["MotorTotalTarget"];
            this.MotorTotalTargetStr = result["MotorTotalTargetStr"];
            this.MotorActualYTD = result["MotorActualYTD"];
            this.MotorActualYTDStr = result["MotorActualYTDStr"];
            this.MotorActualYTDPercent = result["MotorActualYTDPercent"];
            this.MotorWeightageYTD = result["MotorWeightageYTD"];
            this.MotorWeightageYTDStr = result["MotorWeightageYTDStr"];
            this.MotorWeightageYTDPercent = result["MotorWeightageYTDPercent"];

            this.NonMotorTotalTarget = result["NonMotorTotalTarget"];
            this.NonMotorTotalTargetStr = result["NonMotorTotalTargetStr"];
            this.NonMotorActualYTD = result["NonMotorActualYTD"];
            this.NonMotorActualYTDStr = result["NonMotorActualYTDStr"];
            this.NonMotorActualYTDPercent = result["NonMotorActualYTDPercent"];
            this.NonMotorWeightageYTD = result["NonMotorWeightageYTD"];
            this.NonMotorWeightageYTDStr = result["NonMotorWeightageYTDStr"];
            this.NonMotorWeightageYTDPercent =
              result["NonMotorWeightageYTDPercent"];

            this.HealthRetailTotalTarget = result["HealthRetailTotalTarget"];
            this.HealthRetailTotalTargetStr =
              result["HealthRetailTotalTargetStr"];
            this.HealthRetailActualYTD = result["HealthRetailActualYTD"];
            this.HealthRetailActualYTDStr = result["HealthRetailActualYTDStr"];
            this.HealthRetailActualYTDPercent =
              result["HealthRetailActualYTDPercent"];
            this.HealthRetailWeightageYTD = result["HealthRetailWeightageYTD"];
            this.HealthRetailWeightageYTDStr =
              result["HealthRetailWeightageYTDStr"];
            this.HealthRetailWeightageYTDPercent =
              result["HealthRetailWeightageYTDPercent"];

            this.HealthGroupTotalTarget = result["HealthGroupTotalTarget"];
            this.HealthGroupTotalTargetStr =
              result["HealthGroupTotalTargetStr"];
            this.HealthGroupActualYTD = result["HealthGroupActualYTD"];
            this.HealthGroupActualYTDStr = result["HealthGroupActualYTDStr"];
            this.HealthGroupActualYTDPercent =
              result["HealthGroupActualYTDPercent"];
            this.HealthGroupWeightageYTD = result["HealthGroupWeightageYTD"];
            this.HealthGroupWeightageYTDStr =
              result["HealthGroupWeightageYTDStr"];
            this.HealthGroupWeightageYTDPercent =
              result["HealthGroupWeightageYTDPercent"];

            this.LifeRetailTotalTarget = result["LifeRetailTotalTarget"];
            this.LifeRetailTotalTargetStr = result["LifeRetailTotalTargetStr"];
            this.LifeRetailActualYTD = result["LifeRetailActualYTD"];
            this.LifeRetailActualYTDStr = result["LifeRetailActualYTDStr"];
            this.LifeRetailActualYTDPercent =
              result["LifeRetailActualYTDPercent"];
            this.LifeRetailWeightageYTD = result["LifeRetailWeightageYTD"];
            this.LifeRetailWeightageYTDStr =
              result["LifeRetailWeightageYTDStr"];
            this.LifeRetailWeightageYTDPercent =
              result["LifeRetailWeightageYTDPercent"];

            this.LifeGroupTotalTarget = result["LifeGroupTotalTarget"];
            this.LifeGroupTotalTargetStr = result["LifeGroupTotalTargetStr"];
            this.LifeGroupActualYTD = result["LifeGroupActualYTD"];
            this.LifeGroupActualYTDStr = result["LifeGroupActualYTDStr"];
            this.LifeGroupActualYTDPercent =
              result["LifeGroupActualYTDPercent"];
            this.LifeGroupWeightageYTD = result["LifeGroupWeightageYTD"];
            this.LifeGroupWeightageYTDStr = result["LifeGroupWeightageYTDStr"];
            this.LifeGroupWeightageYTDPercent =
              result["LifeGroupWeightageYTDPercent"];

            this.OthersTotalTarget = result["OthersTotalTarget"];
            this.OthersTotalTargetStr = result["OthersTotalTargetStr"];
            this.OthersActualYTD = result["OthersActualYTD"];
            this.OthersActualYTDStr = result["OthersActualYTDStr"];
            this.OthersActualYTDPercent = result["OthersActualYTDPercent"];
            this.OthersWeightageYTD = result["OthersWeightageYTD"];
            this.OthersWeightageYTDStr = result["OthersWeightageYTDStr"];
            this.OthersWeightageYTDPercent =
              result["OthersWeightageYTDPercent"];

            this.ShowLoader2 = "No";
            this.GetActualBusinessAchivement();
            this.GetWeightageBusinessAchivement();
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

  //===== GET ACTUAL ACHIVEMENT IN CHUNKS =====//
  async GetActualBusinessAchivement() {
    for (let i = 0; i < this.AllocatedData[0]["Motor"].length; i++) {
      var MonthName = this.AllocatedData[0]["Motor"][i]["MonthName"];

      var MotorTotalTarget = this.AllocatedData[0]["Motor"][i]["TotalTarget"];
      var MotorTeamTarget = this.AllocatedData[0]["Motor"][i]["TeamTarget"];
      var MotorSelfTarget = this.AllocatedData[0]["Motor"][i]["SelfTarget"];

      var NonMotorTotalTarget =
        this.AllocatedData[1]["Non_Motor"][i]["TotalTarget"];
      var NonMotorTeamTarget =
        this.AllocatedData[1]["Non_Motor"][i]["TeamTarget"];
      var NonMotorSelfTarget =
        this.AllocatedData[1]["Non_Motor"][i]["SelfTarget"];

      var HealthRetailTotalTarget =
        this.AllocatedData[2]["Health_Retail"][i]["TotalTarget"];
      var HealthRetailTeamTarget =
        this.AllocatedData[2]["Health_Retail"][i]["TeamTarget"];
      var HealthRetailSelfTarget =
        this.AllocatedData[2]["Health_Retail"][i]["SelfTarget"];

      var HealthGroupTotalTarget =
        this.AllocatedData[3]["Health_Group"][i]["TotalTarget"];
      var HealthGroupTeamTarget =
        this.AllocatedData[3]["Health_Group"][i]["TeamTarget"];
      var HealthGroupSelfTarget =
        this.AllocatedData[3]["Health_Group"][i]["SelfTarget"];

      var LifeRetailTotalTarget =
        this.AllocatedData[4]["Life_Retail"][i]["TotalTarget"];
      var LifeRetailTeamTarget =
        this.AllocatedData[4]["Life_Retail"][i]["TeamTarget"];
      var LifeRetailSelfTarget =
        this.AllocatedData[4]["Life_Retail"][i]["SelfTarget"];

      var LifeGroupTotalTarget =
        this.AllocatedData[5]["Life_Group"][i]["TotalTarget"];
      var LifeGroupTeamTarget =
        this.AllocatedData[5]["Life_Group"][i]["TeamTarget"];
      var LifeGroupSelfTarget =
        this.AllocatedData[5]["Life_Group"][i]["SelfTarget"];

      var OthersTotalTarget = this.AllocatedData[6]["Others"][i]["TotalTarget"];
      var OthersTeamTarget = this.AllocatedData[6]["Others"][i]["TeamTarget"];
      var OthersSelfTarget = this.AllocatedData[6]["Others"][i]["SelfTarget"];

      var TotalTarget = this.AllocatedData[7]["Total"][i]["TotalTarget"];
      var TotalTeamTarget = this.AllocatedData[7]["Total"][i]["TeamTarget"];
      var TotalSelfTarget = this.AllocatedData[7]["Total"][i]["SelfTarget"];

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Employee_Id", this.Id);
      formData.append("ProfileName", this.Profile_Name);
      formData.append("Coreline", this.Coreline);
      formData.append("financial_year", this.financial_year);
      formData.append("MonthName", MonthName);
      formData.append("Sequence", this.Sequence);
      formData.append("DOJ", this.DOJ);

      formData.append("MotorTotalTarget", MotorTotalTarget);
      formData.append("MotorTeamTarget", MotorTeamTarget);
      formData.append("MotorSelfTarget", MotorSelfTarget);

      formData.append("NonMotorTotalTarget", NonMotorTotalTarget);
      formData.append("NonMotorTeamTarget", NonMotorTeamTarget);
      formData.append("NonMotorSelfTarget", NonMotorSelfTarget);

      formData.append("HealthRetailTotalTarget", HealthRetailTotalTarget);
      formData.append("HealthRetailTeamTarget", HealthRetailTeamTarget);
      formData.append("HealthRetailSelfTarget", HealthRetailSelfTarget);

      formData.append("HealthGroupTotalTarget", HealthGroupTotalTarget);
      formData.append("HealthGroupTeamTarget", HealthGroupTeamTarget);
      formData.append("HealthGroupSelfTarget", HealthGroupSelfTarget);

      formData.append("LifeRetailTotalTarget", LifeRetailTotalTarget);
      formData.append("LifeRetailTeamTarget", LifeRetailTeamTarget);
      formData.append("LifeRetailSelfTarget", LifeRetailSelfTarget);

      formData.append("LifeGroupTotalTarget", LifeGroupTotalTarget);
      formData.append("LifeGroupTeamTarget", LifeGroupTeamTarget);
      formData.append("LifeGroupSelfTarget", LifeGroupSelfTarget);

      formData.append("OthersTotalTarget", OthersTotalTarget);
      formData.append("OthersTeamTarget", OthersTeamTarget);
      formData.append("OthersSelfTarget", OthersSelfTarget);

      formData.append("TotalTarget", TotalTarget);
      formData.append("TotalTeamTarget", TotalTeamTarget);
      formData.append("TotalSelfTarget", TotalSelfTarget);

      formData.append("Portal", "CRM");

      var url =
        environment.apiUrlBmsBase +
        "/goal-management-system/pms/BusinessCalculations/GetActualBusinessAchivementData";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          //== MOTOR START ==//
          this.AllocatedData[0]["Motor"][i]["TotalActualAchivement"] =
            data.MotorTotalAchivement;
          this.AllocatedData[0]["Motor"][i]["TotalActualAchivementStr"] =
            data.MotorTotalAchivementStr;
          this.AllocatedData[0]["Motor"][i]["TotalActualAchivementPercent"] =
            data.MotorTotalAchivementPercent;

          this.AllocatedData[0]["Motor"][i]["TeamActualAchivement"] =
            data.MotorTeamAchivement;
          this.AllocatedData[0]["Motor"][i]["TeamActualAchivementStr"] =
            data.MotorTeamAchivementStr;
          this.AllocatedData[0]["Motor"][i]["TeamActualAchivementPercent"] =
            data.MotorTeamAchivementPercent;

          this.AllocatedData[0]["Motor"][i]["SelfActualAchivement"] =
            data.MotorSelfAchivement;
          this.AllocatedData[0]["Motor"][i]["SelfActualAchivementStr"] =
            data.MotorSelfAchivementStr;
          this.AllocatedData[0]["Motor"][i]["SelfActualAchivementPercent"] =
            data.MotorSelfAchivementPercent;
          //== MOTOR END ==//

          //== NON MOTOR START ==//
          this.AllocatedData[1]["Non_Motor"][i]["TotalActualAchivement"] =
            data.NonMotorTotalAchivement;
          this.AllocatedData[1]["Non_Motor"][i]["TotalActualAchivementStr"] =
            data.NonMotorTotalAchivementStr;
          this.AllocatedData[1]["Non_Motor"][i][
            "TotalActualAchivementPercent"
          ] = data.NonMotorTotalAchivementPercent;

          this.AllocatedData[1]["Non_Motor"][i]["TeamActualAchivement"] =
            data.NonMotorTeamAchivement;
          this.AllocatedData[1]["Non_Motor"][i]["TeamActualAchivementStr"] =
            data.NonMotorTeamAchivementStr;
          this.AllocatedData[1]["Non_Motor"][i]["TeamActualAchivementPercent"] =
            data.NonMotorTeamAchivementPercent;

          this.AllocatedData[1]["Non_Motor"][i]["SelfActualAchivement"] =
            data.NonMotorSelfAchivement;
          this.AllocatedData[1]["Non_Motor"][i]["SelfActualAchivementStr"] =
            data.NonMotorSelfAchivementStr;
          this.AllocatedData[1]["Non_Motor"][i]["SelfActualAchivementPercent"] =
            data.NonMotorSelfAchivementPercent;
          //== NON MOTOR END ==//

          //== HEALTH RETAIL START ==//
          this.AllocatedData[2]["Health_Retail"][i]["TotalActualAchivement"] =
            data.HealthRetailTotalAchivement;
          this.AllocatedData[2]["Health_Retail"][i][
            "TotalActualAchivementStr"
          ] = data.HealthRetailTotalAchivementStr;
          this.AllocatedData[2]["Health_Retail"][i][
            "TotalActualAchivementPercent"
          ] = data.HealthRetailTotalAchivementPercent;

          this.AllocatedData[2]["Health_Retail"][i]["TeamActualAchivement"] =
            data.HealthRetailTeamAchivement;
          this.AllocatedData[2]["Health_Retail"][i]["TeamActualAchivementStr"] =
            data.HealthRetailTeamAchivementStr;
          this.AllocatedData[2]["Health_Retail"][i][
            "TeamActualAchivementPercent"
          ] = data.HealthRetailTeamAchivementPercent;

          this.AllocatedData[2]["Health_Retail"][i]["SelfActualAchivement"] =
            data.HealthRetailSelfAchivement;
          this.AllocatedData[2]["Health_Retail"][i]["SelfActualAchivementStr"] =
            data.HealthRetailSelfAchivementStr;
          this.AllocatedData[2]["Health_Retail"][i][
            "SelfActualAchivementPercent"
          ] = data.HealthRetailSelfAchivementPercent;
          //== HEALTH RETAIL END ==//

          //== HEALTH GROUP START ==//
          this.AllocatedData[3]["Health_Group"][i]["TotalActualAchivement"] =
            data.HealthGroupTotalAchivement;
          this.AllocatedData[3]["Health_Group"][i]["TotalActualAchivementStr"] =
            data.HealthGroupTotalAchivementStr;
          this.AllocatedData[3]["Health_Group"][i][
            "TotalActualAchivementPercent"
          ] = data.HealthGroupTotalAchivementPercent;

          this.AllocatedData[3]["Health_Group"][i]["TeamActualAchivement"] =
            data.HealthGroupTeamAchivement;
          this.AllocatedData[3]["Health_Group"][i]["TeamActualAchivementStr"] =
            data.HealthGroupTeamAchivementStr;
          this.AllocatedData[3]["Health_Group"][i][
            "TeamActualAchivementPercent"
          ] = data.HealthGroupTeamAchivementPercent;

          this.AllocatedData[3]["Health_Group"][i]["SelfActualAchivement"] =
            data.HealthGroupSelfAchivement;
          this.AllocatedData[3]["Health_Group"][i]["SelfActualAchivementStr"] =
            data.HealthGroupSelfAchivementStr;
          this.AllocatedData[3]["Health_Group"][i][
            "SelfActualAchivementPercent"
          ] = data.HealthGroupSelfAchivementPercent;
          //== HEALTH GROUP END ==//

          //== LIFE RETAIL START ==//
          this.AllocatedData[4]["Life_Retail"][i]["TotalActualAchivement"] =
            data.LifeRetailTotalAchivement;
          this.AllocatedData[4]["Life_Retail"][i]["TotalActualAchivementStr"] =
            data.LifeRetailTotalAchivementStr;
          this.AllocatedData[4]["Life_Retail"][i][
            "TotalActualAchivementPercent"
          ] = data.LifeRetailTotalAchivementPercent;

          this.AllocatedData[4]["Life_Retail"][i]["TeamActualAchivement"] =
            data.LifeRetailTeamAchivement;
          this.AllocatedData[4]["Life_Retail"][i]["TeamActualAchivementStr"] =
            data.LifeRetailTeamAchivementStr;
          this.AllocatedData[4]["Life_Retail"][i][
            "TeamActualAchivementPercent"
          ] = data.LifeRetailTeamAchivementPercent;

          this.AllocatedData[4]["Life_Retail"][i]["SelfActualAchivement"] =
            data.LifeRetailSelfAchivement;
          this.AllocatedData[4]["Life_Retail"][i]["SelfActualAchivementStr"] =
            data.LifeRetailSelfAchivementStr;
          this.AllocatedData[4]["Life_Retail"][i][
            "SelfActualAchivementPercent"
          ] = data.LifeRetailSelfAchivementPercent;
          //== LIFE RETAIL END ==//

          //== LIFE RETAIL START ==//
          this.AllocatedData[5]["Life_Group"][i]["TotalActualAchivement"] =
            data.LifeGroupTotalAchivement;
          this.AllocatedData[5]["Life_Group"][i]["TotalActualAchivementStr"] =
            data.LifeGroupTotalAchivementStr;
          this.AllocatedData[5]["Life_Group"][i][
            "TotalActualAchivementPercent"
          ] = data.LifeGroupTotalAchivementPercent;

          this.AllocatedData[5]["Life_Group"][i]["TeamActualAchivement"] =
            data.LifeGroupTeamAchivement;
          this.AllocatedData[5]["Life_Group"][i]["TeamActualAchivementStr"] =
            data.LifeGroupTeamAchivementStr;
          this.AllocatedData[5]["Life_Group"][i][
            "TeamActualAchivementPercent"
          ] = data.LifeGroupTeamAchivementPercent;

          this.AllocatedData[5]["Life_Group"][i]["SelfActualAchivement"] =
            data.LifeGroupSelfAchivement;
          this.AllocatedData[5]["Life_Group"][i]["SelfActualAchivementStr"] =
            data.LifeGroupSelfAchivementStr;
          this.AllocatedData[5]["Life_Group"][i][
            "SelfActualAchivementPercent"
          ] = data.LifeGroupSelfAchivementPercent;
          //== LIFE RETAIL END ==//

          //== OTHERS START ==//
          this.AllocatedData[6]["Others"][i]["TotalActualAchivement"] =
            data.OthersTotalAchivement;
          this.AllocatedData[6]["Others"][i]["TotalActualAchivementStr"] =
            data.OthersTotalAchivementStr;
          this.AllocatedData[6]["Others"][i]["TotalActualAchivementPercent"] =
            data.OthersTotalAchivementPercent;

          this.AllocatedData[6]["Others"][i]["TeamActualAchivement"] =
            data.OthersTeamAchivement;
          this.AllocatedData[6]["Others"][i]["TeamActualAchivementStr"] =
            data.OthersTeamAchivementStr;
          this.AllocatedData[6]["Others"][i]["TeamActualAchivementPercent"] =
            data.OthersTeamAchivementPercent;

          this.AllocatedData[6]["Others"][i]["SelfActualAchivement"] =
            data.OthersSelfAchivement;
          this.AllocatedData[6]["Others"][i]["SelfActualAchivementStr"] =
            data.OthersSelfAchivementStr;
          this.AllocatedData[6]["Others"][i]["SelfActualAchivementPercent"] =
            data.OthersSelfAchivementPercent;
          //== OTHERS END ==//

          //== TOTAL START ==//
          this.AllocatedData[7]["Total"][i]["TotalActualAchivement"] =
            data.TotalAchivement;
          this.AllocatedData[7]["Total"][i]["TotalActualAchivementStr"] =
            data.TotalAchivementStr;
          this.AllocatedData[7]["Total"][i]["TotalActualAchivementPercent"] =
            data.TotalAchivementPercent;

          this.AllocatedData[7]["Total"][i]["TeamActualAchivement"] =
            data.TotalTeamAchivement;
          this.AllocatedData[7]["Total"][i]["TeamActualAchivementStr"] =
            data.TotalTeamAchivementStr;
          this.AllocatedData[7]["Total"][i]["TeamActualAchivementPercent"] =
            data.TotalTeamAchivementPercent;

          this.AllocatedData[7]["Total"][i]["SelfActualAchivement"] =
            data.TotalSelfAchivement;
          this.AllocatedData[7]["Total"][i]["SelfActualAchivementStr"] =
            data.TotalSelfAchivementStr;
          this.AllocatedData[7]["Total"][i]["SelfActualAchivementPercent"] =
            data.TotalSelfAchivementPercent;
          //== TOTAL END ==//
        });
    }
  }

  //===== GET WEIGHTAGE ACHIVEMENT IN CHUNKS =====//
  async GetWeightageBusinessAchivement() {
    for (let i = 0; i < this.AllocatedData[0]["Motor"].length; i++) {
      var MonthName = this.AllocatedData[0]["Motor"][i]["MonthName"];

      var MotorTotalTarget = this.AllocatedData[0]["Motor"][i]["TotalTarget"];
      var MotorTeamTarget = this.AllocatedData[0]["Motor"][i]["TeamTarget"];
      var MotorSelfTarget = this.AllocatedData[0]["Motor"][i]["SelfTarget"];

      var NonMotorTotalTarget =
        this.AllocatedData[1]["Non_Motor"][i]["TotalTarget"];
      var NonMotorTeamTarget =
        this.AllocatedData[1]["Non_Motor"][i]["TeamTarget"];
      var NonMotorSelfTarget =
        this.AllocatedData[1]["Non_Motor"][i]["SelfTarget"];

      var HealthRetailTotalTarget =
        this.AllocatedData[2]["Health_Retail"][i]["TotalTarget"];
      var HealthRetailTeamTarget =
        this.AllocatedData[2]["Health_Retail"][i]["TeamTarget"];
      var HealthRetailSelfTarget =
        this.AllocatedData[2]["Health_Retail"][i]["SelfTarget"];

      var HealthGroupTotalTarget =
        this.AllocatedData[3]["Health_Group"][i]["TotalTarget"];
      var HealthGroupTeamTarget =
        this.AllocatedData[3]["Health_Group"][i]["TeamTarget"];
      var HealthGroupSelfTarget =
        this.AllocatedData[3]["Health_Group"][i]["SelfTarget"];

      var LifeRetailTotalTarget =
        this.AllocatedData[4]["Life_Retail"][i]["TotalTarget"];
      var LifeRetailTeamTarget =
        this.AllocatedData[4]["Life_Retail"][i]["TeamTarget"];
      var LifeRetailSelfTarget =
        this.AllocatedData[4]["Life_Retail"][i]["SelfTarget"];

      var LifeGroupTotalTarget =
        this.AllocatedData[5]["Life_Group"][i]["TotalTarget"];
      var LifeGroupTeamTarget =
        this.AllocatedData[5]["Life_Group"][i]["TeamTarget"];
      var LifeGroupSelfTarget =
        this.AllocatedData[5]["Life_Group"][i]["SelfTarget"];

      var OthersTotalTarget = this.AllocatedData[6]["Others"][i]["TotalTarget"];
      var OthersTeamTarget = this.AllocatedData[6]["Others"][i]["TeamTarget"];
      var OthersSelfTarget = this.AllocatedData[6]["Others"][i]["SelfTarget"];

      var TotalTarget = this.AllocatedData[7]["Total"][i]["TotalTarget"];
      var TotalTeamTarget = this.AllocatedData[7]["Total"][i]["TeamTarget"];
      var TotalSelfTarget = this.AllocatedData[7]["Total"][i]["SelfTarget"];

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Employee_Id", this.Id);
      formData.append("ProfileName", this.Profile_Name);
      formData.append("Coreline", this.Coreline);
      formData.append("financial_year", this.financial_year);
      formData.append("MonthName", MonthName);
      formData.append("Sequence", this.Sequence);
      formData.append("DOJ", this.DOJ);

      formData.append("MotorTotalTarget", MotorTotalTarget);
      formData.append("MotorTeamTarget", MotorTeamTarget);
      formData.append("MotorSelfTarget", MotorSelfTarget);

      formData.append("NonMotorTotalTarget", NonMotorTotalTarget);
      formData.append("NonMotorTeamTarget", NonMotorTeamTarget);
      formData.append("NonMotorSelfTarget", NonMotorSelfTarget);

      formData.append("HealthRetailTotalTarget", HealthRetailTotalTarget);
      formData.append("HealthRetailTeamTarget", HealthRetailTeamTarget);
      formData.append("HealthRetailSelfTarget", HealthRetailSelfTarget);

      formData.append("HealthGroupTotalTarget", HealthGroupTotalTarget);
      formData.append("HealthGroupTeamTarget", HealthGroupTeamTarget);
      formData.append("HealthGroupSelfTarget", HealthGroupSelfTarget);

      formData.append("LifeRetailTotalTarget", LifeRetailTotalTarget);
      formData.append("LifeRetailTeamTarget", LifeRetailTeamTarget);
      formData.append("LifeRetailSelfTarget", LifeRetailSelfTarget);

      formData.append("LifeGroupTotalTarget", LifeGroupTotalTarget);
      formData.append("LifeGroupTeamTarget", LifeGroupTeamTarget);
      formData.append("LifeGroupSelfTarget", LifeGroupSelfTarget);

      formData.append("OthersTotalTarget", OthersTotalTarget);
      formData.append("OthersTeamTarget", OthersTeamTarget);
      formData.append("OthersSelfTarget", OthersSelfTarget);

      formData.append("TotalTarget", TotalTarget);
      formData.append("TotalTeamTarget", TotalTeamTarget);
      formData.append("TotalSelfTarget", TotalSelfTarget);

      formData.append("Portal", "CRM");

      var url =
        environment.apiUrlBmsBase +
        "/goal-management-system/pms/BusinessCalculations/GetWeightageBusinessAchivementData";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          //== MOTOR START ==//
          this.AllocatedData[0]["Motor"][i]["TotalWeightageAchivement"] =
            data.MotorTotalAchivement;
          this.AllocatedData[0]["Motor"][i]["TotalWeightageAchivementStr"] =
            data.MotorTotalAchivementStr;
          this.AllocatedData[0]["Motor"][i]["TotalWeightageAchivementPercent"] =
            data.MotorTotalAchivementPercent;

          this.AllocatedData[0]["Motor"][i]["TeamWeightageAchivement"] =
            data.MotorTeamAchivement;
          this.AllocatedData[0]["Motor"][i]["TeamWeightageAchivementStr"] =
            data.MotorTeamAchivementStr;
          this.AllocatedData[0]["Motor"][i]["TeamWeightageAchivementPercent"] =
            data.MotorTeamAchivementPercent;

          this.AllocatedData[0]["Motor"][i]["SelfWeightageAchivement"] =
            data.MotorSelfAchivement;
          this.AllocatedData[0]["Motor"][i]["SelfWeightageAchivementStr"] =
            data.MotorSelfAchivementStr;
          this.AllocatedData[0]["Motor"][i]["SelfWeightageAchivementPercent"] =
            data.MotorSelfAchivementPercent;
          //== MOTOR END ==//

          //== NON MOTOR START ==//
          this.AllocatedData[1]["Non_Motor"][i]["TotalWeightageAchivement"] =
            data.NonMotorTotalAchivement;
          this.AllocatedData[1]["Non_Motor"][i]["TotalWeightageAchivementStr"] =
            data.NonMotorTotalAchivementStr;
          this.AllocatedData[1]["Non_Motor"][i][
            "TotalWeightageAchivementPercent"
          ] = data.NonMotorTotalAchivementPercent;

          this.AllocatedData[1]["Non_Motor"][i]["TeamWeightageAchivement"] =
            data.NonMotorTeamAchivement;
          this.AllocatedData[1]["Non_Motor"][i]["TeamWeightageAchivementStr"] =
            data.NonMotorTeamAchivementStr;
          this.AllocatedData[1]["Non_Motor"][i][
            "TeamWeightageAchivementPercent"
          ] = data.NonMotorTeamAchivementPercent;

          this.AllocatedData[1]["Non_Motor"][i]["SelfWeightageAchivement"] =
            data.NonMotorSelfAchivement;
          this.AllocatedData[1]["Non_Motor"][i]["SelfWeightageAchivementStr"] =
            data.NonMotorSelfAchivementStr;
          this.AllocatedData[1]["Non_Motor"][i][
            "SelfWeightageAchivementPercent"
          ] = data.NonMotorSelfAchivementPercent;
          //== NON MOTOR END ==//

          //== HEALTH RETAIL START ==//
          this.AllocatedData[2]["Health_Retail"][i][
            "TotalWeightageAchivement"
          ] = data.HealthRetailTotalAchivement;
          this.AllocatedData[2]["Health_Retail"][i][
            "TotalWeightageAchivementStr"
          ] = data.HealthRetailTotalAchivementStr;
          this.AllocatedData[2]["Health_Retail"][i][
            "TotalWeightageAchivementPercent"
          ] = data.HealthRetailTotalAchivementPercent;

          this.AllocatedData[2]["Health_Retail"][i]["TeamWeightageAchivement"] =
            data.HealthRetailTeamAchivement;
          this.AllocatedData[2]["Health_Retail"][i][
            "TeamWeightageAchivementStr"
          ] = data.HealthRetailTeamAchivementStr;
          this.AllocatedData[2]["Health_Retail"][i][
            "TeamWeightageAchivementPercent"
          ] = data.HealthRetailTeamAchivementPercent;

          this.AllocatedData[2]["Health_Retail"][i]["SelfWeightageAchivement"] =
            data.HealthRetailSelfAchivement;
          this.AllocatedData[2]["Health_Retail"][i][
            "SelfWeightageAchivementStr"
          ] = data.HealthRetailSelfAchivementStr;
          this.AllocatedData[2]["Health_Retail"][i][
            "SelfWeightageAchivementPercent"
          ] = data.HealthRetailSelfAchivementPercent;
          //== HEALTH RETAIL END ==//

          //== HEALTH GROUP START ==//
          this.AllocatedData[3]["Health_Group"][i]["TotalWeightageAchivement"] =
            data.HealthGroupTotalAchivement;
          this.AllocatedData[3]["Health_Group"][i][
            "TotalWeightageAchivementStr"
          ] = data.HealthGroupTotalAchivementStr;
          this.AllocatedData[3]["Health_Group"][i][
            "TotalWeightageAchivementPercent"
          ] = data.HealthGroupTotalAchivementPercent;

          this.AllocatedData[3]["Health_Group"][i]["TeamWeightageAchivement"] =
            data.HealthGroupTeamAchivement;
          this.AllocatedData[3]["Health_Group"][i][
            "TeamWeightageAchivementStr"
          ] = data.HealthGroupTeamAchivementStr;
          this.AllocatedData[3]["Health_Group"][i][
            "TeamWeightageAchivementPercent"
          ] = data.HealthGroupTeamAchivementPercent;

          this.AllocatedData[3]["Health_Group"][i]["SelfWeightageAchivement"] =
            data.HealthGroupSelfAchivement;
          this.AllocatedData[3]["Health_Group"][i][
            "SelfWeightageAchivementStr"
          ] = data.HealthGroupSelfAchivementStr;
          this.AllocatedData[3]["Health_Group"][i][
            "SelfWeightageAchivementPercent"
          ] = data.HealthGroupSelfAchivementPercent;
          //== HEALTH GROUP END ==//

          //== LIFE RETAIL START ==//
          this.AllocatedData[4]["Life_Retail"][i]["TotalWeightageAchivement"] =
            data.LifeRetailTotalAchivement;
          this.AllocatedData[4]["Life_Retail"][i][
            "TotalWeightageAchivementStr"
          ] = data.LifeRetailTotalAchivementStr;
          this.AllocatedData[4]["Life_Retail"][i][
            "TotalWeightageAchivementPercent"
          ] = data.LifeRetailTotalAchivementPercent;

          this.AllocatedData[4]["Life_Retail"][i]["TeamWeightageAchivement"] =
            data.LifeRetailTeamAchivement;
          this.AllocatedData[4]["Life_Retail"][i][
            "TeamWeightageAchivementStr"
          ] = data.LifeRetailTeamAchivementStr;
          this.AllocatedData[4]["Life_Retail"][i][
            "TeamWeightageAchivementPercent"
          ] = data.LifeRetailTeamAchivementPercent;

          this.AllocatedData[4]["Life_Retail"][i]["SelfWeightageAchivement"] =
            data.LifeRetailSelfAchivement;
          this.AllocatedData[4]["Life_Retail"][i][
            "SelfWeightageAchivementStr"
          ] = data.LifeRetailSelfAchivementStr;
          this.AllocatedData[4]["Life_Retail"][i][
            "SelfWeightageAchivementPercent"
          ] = data.LifeRetailSelfAchivementPercent;
          //== LIFE RETAIL END ==//

          //== LIFE RETAIL START ==//
          this.AllocatedData[5]["Life_Group"][i]["TotalWeightageAchivement"] =
            data.LifeGroupTotalAchivement;
          this.AllocatedData[5]["Life_Group"][i][
            "TotalWeightageAchivementStr"
          ] = data.LifeGroupTotalAchivementStr;
          this.AllocatedData[5]["Life_Group"][i][
            "TotalWeightageAchivementPercent"
          ] = data.LifeGroupTotalAchivementPercent;

          this.AllocatedData[5]["Life_Group"][i]["TeamWeightageAchivement"] =
            data.LifeGroupTeamAchivement;
          this.AllocatedData[5]["Life_Group"][i]["TeamWeightageAchivementStr"] =
            data.LifeGroupTeamAchivementStr;
          this.AllocatedData[5]["Life_Group"][i][
            "TeamWeightageAchivementPercent"
          ] = data.LifeGroupTeamAchivementPercent;

          this.AllocatedData[5]["Life_Group"][i]["SelfWeightageAchivement"] =
            data.LifeGroupSelfAchivement;
          this.AllocatedData[5]["Life_Group"][i]["SelfWeightageAchivementStr"] =
            data.LifeGroupSelfAchivementStr;
          this.AllocatedData[5]["Life_Group"][i][
            "SelfWeightageAchivementPercent"
          ] = data.LifeGroupSelfAchivementPercent;
          //== LIFE RETAIL END ==//

          //== OTHERS START ==//
          this.AllocatedData[6]["Others"][i]["TotalWeightageAchivement"] =
            data.OthersTotalAchivement;
          this.AllocatedData[6]["Others"][i]["TotalWeightageAchivementStr"] =
            data.OthersTotalAchivementStr;
          this.AllocatedData[6]["Others"][i][
            "TotalWeightageAchivementPercent"
          ] = data.OthersTotalAchivementPercent;

          this.AllocatedData[6]["Others"][i]["TeamWeightageAchivement"] =
            data.OthersTeamAchivement;
          this.AllocatedData[6]["Others"][i]["TeamWeightageAchivementStr"] =
            data.OthersTeamAchivementStr;
          this.AllocatedData[6]["Others"][i]["TeamWeightageAchivementPercent"] =
            data.OthersTeamAchivementPercent;

          this.AllocatedData[6]["Others"][i]["SelfWeightageAchivement"] =
            data.OthersSelfAchivement;
          this.AllocatedData[6]["Others"][i]["SelfWeightageAchivementStr"] =
            data.OthersSelfAchivementStr;
          this.AllocatedData[6]["Others"][i]["SelfWeightageAchivementPercent"] =
            data.OthersSelfAchivementPercent;
          //== OTHERS END ==//

          //== TOTAL START ==//
          this.AllocatedData[7]["Total"][i]["TotalWeightageAchivement"] =
            data.TotalAchivement;
          this.AllocatedData[7]["Total"][i]["TotalWeightageAchivementStr"] =
            data.TotalAchivementStr;
          this.AllocatedData[7]["Total"][i]["TotalWeightageAchivementPercent"] =
            data.TotalAchivementPercent;

          this.AllocatedData[7]["Total"][i]["TeamWeightageAchivement"] =
            data.TotalTeamAchivement;
          this.AllocatedData[7]["Total"][i]["TeamWeightageAchivementStr"] =
            data.TotalTeamAchivementStr;
          this.AllocatedData[7]["Total"][i]["TeamWeightageAchivementPercent"] =
            data.TotalTeamAchivementPercent;

          this.AllocatedData[7]["Total"][i]["SelfWeightageAchivement"] =
            data.TotalSelfAchivement;
          this.AllocatedData[7]["Total"][i]["SelfWeightageAchivementStr"] =
            data.TotalSelfAchivementStr;
          this.AllocatedData[7]["Total"][i]["SelfWeightageAchivementPercent"] =
            data.TotalSelfAchivementPercent;
          //== TOTAL END ==//
        });
    }
  }

  //===== GET EMPLOYEE POS TARGET =====//
  GetAllocatedPosTarget() {
    const formData = new FormData();

    formData.append("Id", this.Id);
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("UrlSegment", this.UrlSegment);
    formData.append("Profile_Name", this.Profile_Name);
    formData.append("Is_Sales", this.Is_Sales);
    formData.append("Portal", "CRM");
    formData.append("VerticalId", this.VerticalId);
    formData.append("financial_year", this.financial_year);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "goal-management-system/pms/PosTargets/" + this.Url,
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            if (this.UrlSegment == "EmployeeTarget") {
              this.AllocatedPosData = result["TotalTarget"];
              this.Is_Edit = result["Is_Edit"];
              this.Is_Edit_RM = result["Is_Edit_RM"];

              this.AllocatedPosTotal = result["TotalPosTarget"];
              this.AllocatedPosYTD = result["TotalPosYTD"];
              this.AllocatedPosYTDPercent = result["TotalPosYTDPercent"];

              this.ActivePosTotal = result["TotalActivePosTarget"];
              this.ActivePosYTD = result["TotalActivePosYTD"];
              this.ActivePosYTDPercent = result["TotalActivePosYTDPercent"];

              this.GetCompletePosAchivement();
              this.GetAllocatedPosAchivement();
            }
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

  //===== GET ACTIVE POS ACHIVEMENT COMPLETE DATA IN CHUNKS =====//
  async GetCompletePosAchivement() {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("Employee_Id", this.Id);
    formData.append("financial_year", this.financial_year);
    formData.append("Portal", "CRM");

    var url =
      environment.apiUrlBmsBase +
      "/goal-management-system/LazyCalculations/GetActivePosAchivementData";

    await this.http
      .post<any>(
        this.api.additionParmsEnc(url),
        this.api.enc_FormData(formData),
        this.api.getHeader(environment.apiUrlBmsBase)
      )
      .toPromise()
      .then((res: any) => {
        var data = JSON.parse(this.api.decryptText(res.response));

        this.ActivePosTotal = data["TotalActivePosTarget"];
        this.TotalActiveTarget = data["TotalActiveTarget"];
        this.ActivePosYTD = data["TotalActivePosYTD"];
        this.ActivePosYTDPercent = data["TotalActivePosYTDPercent"];
      });
  }

  //===== GET PROFILE ACHIVEMENT IN CHUNKS =====//
  async GetAllocatedPosAchivement() {
    for (let i = 0; i < this.AllocatedPosData[0]["PosTarget"].length; i++) {
      var MonthName = this.AllocatedPosData[0]["PosTarget"][i]["MonthName"];
      var PosTarget = this.AllocatedPosData[0]["PosTarget"][i]["Value"];
      var SelfTarget = this.AllocatedPosData[0]["PosTarget"][i]["SelfTarget"];
      var ActivePos = this.AllocatedPosData[1]["ActivePos"][i]["Value"];

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Employee_Id", this.Id);
      formData.append("financial_year", this.financial_year);
      formData.append("MonthName", MonthName);
      formData.append("Sequence", this.Sequence);
      formData.append("DOJ", this.DOJ);
      formData.append("PosTarget", PosTarget);
      formData.append("SelfTarget", SelfTarget);
      formData.append("ActivePos", ActivePos);
      formData.append("Portal", "CRM");

      var url =
        environment.apiUrlBmsBase +
        "/goal-management-system/LazyCalculations/GetAllocatedPosAchivementData";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          this.AllocatedPosData[0]["PosTarget"][i]["TotalAchivement"] =
            data.TotalAchivement;
          this.AllocatedPosData[0]["PosTarget"][i]["AchivementPercent"] =
            data.TotalAchivementPercent;

          this.AllocatedPosData[0]["PosTarget"][i]["TotalSelfAchivement"] =
            data.TotalSelfAchivement;
          this.AllocatedPosData[0]["PosTarget"][i]["SelfAchivementPercent"] =
            data.SelfAchivementPercent;

          this.AllocatedPosData[0]["PosTarget"][i]["EditAllowed"] =
            data.EditAllowed;

          this.AllocatedPosData[1]["ActivePos"][i]["TotalAchivement"] =
            data.ActiveTotalAchivement;
          this.AllocatedPosData[1]["ActivePos"][i]["AchivementPercent"] =
            data.ActiveTotalAchivementPercent;

          this.AllocatedPosData[1]["ActivePos"][i]["TotalSelfAchivement"] =
            data.ActiveSelfAchivement;
          this.AllocatedPosData[1]["ActivePos"][i]["SelfAchivementPercent"] =
            data.ActiveSelfAchivementPercent;
        });
    }
  }

  //===== GET EMPLOYEE POS TARGET =====//
  SendMail() {
    const formData = new FormData();

    formData.append("Id", this.Id);
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("UrlSegment", this.UrlSegment);
    formData.append("Profile_Name", this.Profile_Name);
    formData.append("Is_Sales", this.Is_Sales);
    formData.append("Portal", "CRM");
    formData.append("VerticalId", this.VerticalId);
    formData.append("financial_year", this.financial_year);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "goal-management-system/AllocatedBusinessTargets/MailByRM",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
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
}
