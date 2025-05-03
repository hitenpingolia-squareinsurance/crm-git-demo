import { Component, OnInit, Inject } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ApiService } from "../../../providers/api.service";
import { environment } from "../../../../environments/environment";

import { Router } from "@angular/router";
import { EditTargetComponent } from "../../../modals/goal-management/edit-target/edit-target.component";

@Component({
  selector: "app-target-details",
  templateUrl: "./target-details.component.html",
  styleUrls: ["./target-details.component.css"],
})
export class TargetDetailsComponent implements OnInit {
  SearchForm: FormGroup;
  isSubmitted = false;
  Id: any;
  row: any;
  MainIndex: any = 0;
  User_Rights: any = [];
  ShowLoader1: any = "Yes";
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
  CompleteTarget: any = 0;
  MotorTotal: any = 0;
  MotorYTD: any = 0;
  MotorYTDPercent: any = 0;

  NonMotorTotal: any = 0;
  NonMotorYTD: any = 0;
  NonMotorYTDPercent: any = 0;

  HealthTotal: any = 0;
  HealthYTD: any = 0;
  HealthYTDPercent: any = 0;

  LifeTotal: any = 0;
  LifeYTD: any = 0;
  LifeYTDPercent: any = 0;

  OthersTotal: any = 0;
  OthersYTD: any = 0;
  OthersYTDPercent: any = 0;

  PosTotal: any = 0;
  PosYTD: any = 0;
  PosYTDPercent: any = 0;

  AllocatedCompleteTarget: any = 0;
  AllocatedMotorTotal: any = 0;
  AllocatedMotorYTD: any = 0;
  AllocatedMotorYTDPercent: any = 0;

  AllocatedNonMotorTotal: any = 0;
  AllocatedNonMotorYTD: any = 0;
  AllocatedNonMotorYTDPercent: any = 0;

  AllocatedHealthRetailTotal: any = 0;
  AllocatedHealthRetailYTD: any = 0;
  AllocatedHealthRetailYTDPercent: any = 0;

  AllocatedHealthGroupTotal: any = 0;
  AllocatedHealthGroupYTD: any = 0;
  AllocatedHealthGroupYTDPercent: any = 0;

  AllocatedLifeRetailTotal: any = 0;
  AllocatedLifeRetailYTD: any = 0;
  AllocatedLifeRetailYTDPercent: any = 0;

  AllocatedLifeGroupTotal: any = 0;
  AllocatedLifeGroupYTD: any = 0;
  AllocatedLifeGroupYTDPercent: any = 0;

  AllocatedOthersTotal: any = 0;
  AllocatedOthersYTD: any = 0;
  AllocatedOthersYTDPercent: any = 0;

  AllocatedPosTotal: any = 0;
  AllocatedPosYTD: any = 0;
  AllocatedPosYTDPercent: any = 0;

  dropdownSettingsSingle: any = {};
  Is_Edit_RM: any;
  Url: string;
  NewCompleteTarget: any;
  NewMotorTotal: any;
  NewNonMotorTotal: any;
  NewHealthTotal: any;
  NewLifeTotal: any;
  NewOthersTotal: any;

  NewAllocatedCompleteTarget: any;
  NewAllocatedMotorTotal: any;
  NewAllocatedNonMotorTotal: any;
  NewAllocatedHealthRetailTotal: any;
  NewAllocatedHealthGroupTotal: any;
  NewAllocatedLifeRetailTotal: any;
  NewAllocatedLifeGroupTotal: any;
  NewAllocatedOthersTotal: any;

  NewMotorYTD: any;
  NewNonMotorYTD: any;
  NewHealthYTD: any;
  NewLifeYTD: any;
  NewOthersYTD: any;

  NewAllocatedMotorYTD: any;
  NewAllocatedNonMotorYTD: any;
  NewAllocatedHealthRetailYTD: any;
  NewAllocatedHealthGroupYTD: any;
  NewAllocatedLifeRetailYTD: any;
  NewAllocatedLifeGroupYTD: any;
  NewAllocatedOthersYTD: any;

  Total: any;
  NewTotal: any;
  TotalYTD: any;
  NewTotalYTD: any;
  TotalYTDPercent: any;

  AllocatedTotal: any;
  NewAllocatedTotal: any;
  AllocatedTotalYTD: any;
  NewAllocatedTotalYTD: any;
  AllocatedTotalYTDPercent: any;
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

  constructor(
    public dialogRef: MatDialogRef<TargetDetailsComponent>,
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

    if (this.Id == 43 || this.Id == 44) {
      this.Url = "GetAllEmployeeTargetsData";
    } else {
      this.Url = "GetSelfTargetsData";
    }

    this.GetLobArray();

    //Only For Sales
    if (this.Is_Sales == 1) {
      this.GetEmployeeProfileBusinessTarget();
      this.GetProfilePosTarget();
    }

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
        (result: any) => {
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

  //===== GET EMPLOYEE PROFILE BUSINESS TARGET =====//
  GetEmployeeProfileBusinessTarget() {
    const formData = new FormData();

    formData.append("Id", this.Id);
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("UrlSegment", this.UrlSegment);
    formData.append("Portal", "CRM");
    formData.append("Profile_Name", this.Profile_Name);
    formData.append("Is_Sales", this.Is_Sales);
    formData.append("VerticalId", this.VerticalId);
    formData.append("financial_year", this.financial_year);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "goal-management-system/ProfileBusinessTargets/" + this.Url,
        formData
      )
      .then(
        (result: any) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.datas = result["TotalTarget"];
            this.CompleteTarget = result["CompleteTarget"];
            this.NewCompleteTarget = result["NewCompleteTarget"];

            this.MotorTotal = result["MotorTotal"];
            this.NewMotorTotal = result["NewMotorTotal"];
            this.MotorYTD = result["MotorYTD"];
            this.NewMotorYTD = result["NewMotorYTD"];
            this.MotorYTDPercent = result["MotorYTDPercent"];

            this.NonMotorTotal = result["NonMotorTotal"];
            this.NewNonMotorTotal = result["NewNonMotorTotal"];
            this.NonMotorYTD = result["NonMotorYTD"];
            this.NewNonMotorYTD = result["NewNonMotorYTD"];
            this.NonMotorYTDPercent = result["NonMotorYTDPercent"];

            this.HealthTotal = result["HealthTotal"];
            this.NewHealthTotal = result["NewHealthTotal"];
            this.HealthYTD = result["HealthYTD"];
            this.NewHealthYTD = result["NewHealthYTD"];
            this.HealthYTDPercent = result["HealthYTDPercent"];

            this.LifeTotal = result["LifeTotal"];
            this.NewLifeTotal = result["NewLifeTotal"];
            this.LifeYTD = result["LifeYTD"];
            this.NewLifeYTD = result["NewLifeYTD"];
            this.LifeYTDPercent = result["LifeYTDPercent"];

            this.OthersTotal = result["OthersTotal"];
            this.NewOthersTotal = result["NewOthersTotal"];
            this.OthersYTD = result["OthersYTD"];
            this.NewOthersYTD = result["NewOthersYTD"];
            this.OthersYTDPercent = result["OthersYTDPercent"];

            this.Total = result["Total"];
            this.NewTotal = result["NewTotal"];
            this.TotalYTD = result["TotalYTD"];
            this.NewTotalYTD = result["NewTotalYTD"];
            this.TotalYTDPercent = result["TotalYTDPercent"];

            this.ShowLoader1 = "No";
            this.GetProfileBusinessAchivement();
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

  //===== GET PROFILE ACHIVEMENT IN CHUNKS =====//
  async GetProfileBusinessAchivement() {
    for (let i = 0; i < this.datas[0]["Motor"].length; i++) {
      var MonthName = this.datas[0]["Motor"][i]["MonthName"];
      var MotorTarget = this.datas[0]["Motor"][i]["Value"];
      var NonMotorTarget = this.datas[1]["Non_Motor"][i]["Value"];
      var HealthTarget = this.datas[2]["Health"][i]["Value"];
      var LifeTarget = this.datas[3]["Life"][i]["Value"];
      var OthersTarget = this.datas[4]["Others"][i]["Value"];
      var TotalTarget = this.datas[5]["Total"][i]["Value"];

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Employee_Id", this.Id);
      formData.append("ProfileName", this.Profile_Name);
      formData.append("financial_year", this.financial_year);
      formData.append("MonthName", MonthName);
      formData.append("MotorTarget", MotorTarget);
      formData.append("NonMotorTarget", NonMotorTarget);
      formData.append("HealthTarget", HealthTarget);
      formData.append("LifeTarget", LifeTarget);
      formData.append("OthersTarget", OthersTarget);
      formData.append("TotalTarget", TotalTarget);
      formData.append("Portal", "CRM");

      var url =
        environment.apiUrlBmsBase +
        "/goal-management-system/LazyCalculations/GetProfileTargetsAchivementData";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          this.datas[0]["Motor"][i]["TotalAchivement"] =
            data.MotorTotalAchivement;
          this.datas[0]["Motor"][i]["NewTotalAchivement"] =
            data.NewMotorTotalAchivement;
          this.datas[0]["Motor"][i]["AchivementPercent"] =
            data.MotorAchivementPercent;

          this.datas[1]["Non_Motor"][i]["TotalAchivement"] =
            data.NonMotorTotalAchivement;
          this.datas[1]["Non_Motor"][i]["NewTotalAchivement"] =
            data.NewNonMotorTotalAchivement;
          this.datas[1]["Non_Motor"][i]["AchivementPercent"] =
            data.NonMotorAchivementPercent;

          this.datas[2]["Health"][i]["TotalAchivement"] =
            data.HealthTotalAchivement;
          this.datas[2]["Health"][i]["NewTotalAchivement"] =
            data.NewHealthTotalAchivement;
          this.datas[2]["Health"][i]["AchivementPercent"] =
            data.HealthAchivementPercent;

          this.datas[3]["Life"][i]["TotalAchivement"] =
            data.LifeTotalAchivement;
          this.datas[3]["Life"][i]["NewTotalAchivement"] =
            data.NewLifeTotalAchivement;
          this.datas[3]["Life"][i]["AchivementPercent"] =
            data.LifeAchivementPercent;

          this.datas[4]["Others"][i]["TotalAchivement"] =
            data.OthersTotalAchivement;
          this.datas[4]["Others"][i]["NewTotalAchivement"] =
            data.NewOthersTotalAchivement;
          this.datas[4]["Others"][i]["AchivementPercent"] =
            data.OthersAchivementPercent;

          this.datas[5]["Total"][i]["TotalAchivement"] = data.TotalAchivement;
          this.datas[5]["Total"][i]["NewTotalAchivement"] =
            data.NewTotalAchivement;
          this.datas[5]["Total"][i]["AchivementPercent"] =
            data.TotalAchivementPercent;
        });
    }
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
    formData.append("financial_year", this.financial_year);

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "goal-management-system/AllocatedBusinessTargets/" + this.Url,
        formData
      )
      .then(
        (result: any) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.AllocatedData = result["TotalTarget"];

            this.Is_Edit = result["Is_Edit"];
            this.Is_Edit_RM = result["Is_Edit_RM"];
            this.AllocatedCompleteTarget = result["CompleteTarget"];
            this.NewAllocatedCompleteTarget = result["NewCompleteTarget"];

            this.AllocatedMotorTotal = result["MotorTotal"];
            this.NewAllocatedMotorTotal = result["NewMotorTotal"];
            this.AllocatedMotorYTD = result["MotorYTD"];
            this.NewAllocatedMotorYTD = result["NewMotorYTD"];
            this.AllocatedMotorYTDPercent = result["MotorYTDPercent"];

            this.AllocatedNonMotorTotal = result["NonMotorTotal"];
            this.NewAllocatedNonMotorTotal = result["NewNonMotorTotal"];
            this.AllocatedNonMotorYTD = result["NonMotorYTD"];
            this.NewAllocatedNonMotorYTD = result["NewNonMotorYTD"];
            this.AllocatedNonMotorYTDPercent = result["NonMotorYTDPercent"];

            this.AllocatedHealthRetailTotal = result["HealthRetailTotal"];
            this.NewAllocatedHealthRetailTotal = result["NewHealthRetailTotal"];
            this.AllocatedHealthRetailYTD = result["HealthRetailYTD"];
            this.NewAllocatedHealthRetailYTD = result["NewHealthRetailYTD"];
            this.AllocatedHealthRetailYTDPercent =
              result["HealthRetailYTDPercent"];

            this.AllocatedHealthGroupTotal = result["HealthGroupTotal"];
            this.NewAllocatedHealthGroupTotal = result["NewHealthGroupTotal"];
            this.AllocatedHealthGroupYTD = result["HealthGroupYTD"];
            this.NewAllocatedHealthGroupYTD = result["NewHealthGroupYTD"];
            this.AllocatedHealthGroupYTDPercent =
              result["HealthGroupYTDPercent"];

            this.AllocatedLifeRetailTotal = result["LifeRetailTotal"];
            this.NewAllocatedLifeRetailTotal = result["NewLifeRetailTotal"];
            this.AllocatedLifeRetailYTD = result["LifeRetailYTD"];
            this.NewAllocatedLifeRetailYTD = result["NewLifeRetailYTD"];
            this.AllocatedLifeRetailYTDPercent = result["LifeRetailYTDPercent"];

            this.AllocatedLifeGroupTotal = result["LifeGroupTotal"];
            this.NewAllocatedLifeGroupTotal = result["NewLifeGroupTotal"];
            this.AllocatedLifeGroupYTD = result["LifeGroupYTD"];
            this.NewAllocatedLifeGroupYTD = result["NewLifeGroupYTD"];
            this.AllocatedLifeGroupYTDPercent = result["LifeGroupYTDPercent"];

            this.AllocatedOthersTotal = result["OthersTotal"];
            this.NewAllocatedOthersTotal = result["NewOthersTotal"];
            this.AllocatedOthersYTD = result["OthersYTD"];
            this.NewAllocatedOthersYTD = result["NewOthersYTD"];
            this.AllocatedOthersYTDPercent = result["OthersYTDPercent"];

            this.AllocatedTotal = result["Total"];
            this.NewAllocatedTotal = result["NewTotal"];
            this.AllocatedTotalYTD = result["TotalYTD"];
            this.NewAllocatedTotalYTD = result["NewTotalYTD"];
            this.AllocatedTotalYTDPercent = result["TotalYTDPercent"];

            this.ShowLoader2 = "No";
            this.GetAllocatedBusinessAchivement();
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

  //===== GET ALLOCATED ACHIVEMENT IN CHUNKS =====//
  async GetAllocatedBusinessAchivement() {
    for (let i = 0; i < this.AllocatedData[0]["Motor"].length; i++) {
      var MonthName = this.AllocatedData[0]["Motor"][i]["MonthName"];

      var MotorTarget = this.AllocatedData[0]["Motor"][i]["Value"];
      var MotorSelfTarget = this.AllocatedData[0]["Motor"][i]["SelfTarget"];

      var NonMotorTarget = this.AllocatedData[1]["Non_Motor"][i]["Value"];
      var NonMotorSelfTarget =
        this.AllocatedData[1]["Non_Motor"][i]["SelfTarget"];

      var HealthRetailTarget =
        this.AllocatedData[2]["Health_Retail"][i]["Value"];
      var HealthRetailSelfTarget =
        this.AllocatedData[2]["Health_Retail"][i]["SelfTarget"];

      var HealthGroupTarget = this.AllocatedData[3]["Health_Group"][i]["Value"];
      var HealthGroupSelfTarget =
        this.AllocatedData[3]["Health_Group"][i]["SelfTarget"];

      var LifeRetailTarget = this.AllocatedData[4]["Life_Retail"][i]["Value"];
      var LifeRetailSelfTarget =
        this.AllocatedData[4]["Life_Retail"][i]["SelfTarget"];

      var LifeGroupTarget = this.AllocatedData[5]["Life_Group"][i]["Value"];
      var LifeGroupSelfTarget =
        this.AllocatedData[5]["Life_Group"][i]["SelfTarget"];

      var OthersTarget = this.AllocatedData[6]["Others"][i]["Value"];
      var OthersSelfTarget = this.AllocatedData[6]["Others"][i]["SelfTarget"];

      var TotalTarget = this.AllocatedData[7]["Total"][i]["Value"];
      var TotalSelfTarget = this.AllocatedData[7]["Total"][i]["SelfTarget"];

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Employee_Id", this.Id);
      formData.append("ProfileName", this.Profile_Name);
      formData.append("financial_year", this.financial_year);
      formData.append("MonthName", MonthName);
      formData.append("Sequence", this.Sequence);
      formData.append("DOJ", this.DOJ);
      formData.append("MotorTarget", MotorTarget);
      formData.append("MotorSelfTarget", MotorSelfTarget);

      formData.append("NonMotorTarget", NonMotorTarget);
      formData.append("NonMotorSelfTarget", NonMotorSelfTarget);

      formData.append("HealthRetailTarget", HealthRetailTarget);
      formData.append("HealthRetailSelfTarget", HealthRetailSelfTarget);

      formData.append("HealthGroupTarget", HealthGroupTarget);
      formData.append("HealthGroupSelfTarget", HealthGroupSelfTarget);

      formData.append("LifeRetailTarget", LifeRetailTarget);
      formData.append("LifeRetailSelfTarget", LifeRetailSelfTarget);

      formData.append("LifeGroupTarget", LifeGroupTarget);
      formData.append("LifeGroupSelfTarget", LifeGroupSelfTarget);

      formData.append("OthersTarget", OthersTarget);
      formData.append("OthersSelfTarget", OthersSelfTarget);

      formData.append("TotalTarget", TotalTarget);
      formData.append("TotalSelfTarget", TotalSelfTarget);

      formData.append("Portal", "CRM");

      var url =
        environment.apiUrlBmsBase +
        "/goal-management-system/LazyCalculations/GetAllocatedTargetsAchivementData";

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
          this.AllocatedData[0]["Motor"][i]["TotalAchivement"] =
            data.MotorTotalAchivement;
          this.AllocatedData[0]["Motor"][i]["NewTotalAchivement"] =
            data.NewMotorTotalAchivement;
          this.AllocatedData[0]["Motor"][i]["AchivementPercent"] =
            data.MotorAchivementPercent;

          this.AllocatedData[0]["Motor"][i]["TotalSelfAchivement"] =
            data.MotorSelfAchivement;
          this.AllocatedData[0]["Motor"][i]["NewTotalSelfAchivement"] =
            data.NewMotorSelfAchivement;
          this.AllocatedData[0]["Motor"][i]["SelfAchivementPercent"] =
            data.MotorSelfAchivementPercent;

          this.AllocatedData[0]["Motor"][i]["EditAllowed"] = data.EditAllowed;
          //== MOTOR END ==//

          //== NON MOTOR START ==//
          this.AllocatedData[1]["Non_Motor"][i]["TotalAchivement"] =
            data.NonMotorTotalAchivement;
          this.AllocatedData[1]["Non_Motor"][i]["NewTotalAchivement"] =
            data.NewNonMotorTotalAchivement;
          this.AllocatedData[1]["Non_Motor"][i]["AchivementPercent"] =
            data.NonMotorAchivementPercent;

          this.AllocatedData[1]["Non_Motor"][i]["TotalSelfAchivement"] =
            data.NonMotorSelfAchivement;
          this.AllocatedData[1]["Non_Motor"][i]["NewTotalSelfAchivement"] =
            data.NewNonMotorSelfAchivement;
          this.AllocatedData[1]["Non_Motor"][i]["SelfAchivementPercent"] =
            data.NonMotorSelfAchivementPercent;

          this.AllocatedData[1]["Non_Motor"][i]["EditAllowed"] =
            data.EditAllowed;
          //== NON MOTOR END ==//

          //== HEALTH RETAIL START ==//
          this.AllocatedData[2]["Health_Retail"][i]["TotalAchivement"] =
            data.HealthRetailTotalAchivement;
          this.AllocatedData[2]["Health_Retail"][i]["NewTotalAchivement"] =
            data.NewHealthRetailTotalAchivement;
          this.AllocatedData[2]["Health_Retail"][i]["AchivementPercent"] =
            data.HealthRetailAchivementPercent;

          this.AllocatedData[2]["Health_Retail"][i]["TotalSelfAchivement"] =
            data.HealthRetailSelfAchivement;
          this.AllocatedData[2]["Health_Retail"][i]["NewTotalSelfAchivement"] =
            data.NewHealthRetailSelfAchivement;
          this.AllocatedData[2]["Health_Retail"][i]["SelfAchivementPercent"] =
            data.HealthRetailSelfAchivementPercent;

          this.AllocatedData[2]["Health_Retail"][i]["EditAllowed"] =
            data.EditAllowed;
          //== HEALTH RETAIL END ==//

          //== HEALTH GROUP START ==//
          this.AllocatedData[3]["Health_Group"][i]["TotalAchivement"] =
            data.HealthGroupTotalAchivement;
          this.AllocatedData[3]["Health_Group"][i]["NewTotalAchivement"] =
            data.NewHealthGroupTotalAchivement;
          this.AllocatedData[3]["Health_Group"][i]["AchivementPercent"] =
            data.HealthGroupAchivementPercent;

          this.AllocatedData[3]["Health_Group"][i]["TotalSelfAchivement"] =
            data.HealthGroupSelfAchivement;
          this.AllocatedData[3]["Health_Group"][i]["NewTotalSelfAchivement"] =
            data.NewHealthGroupSelfAchivement;
          this.AllocatedData[3]["Health_Group"][i]["SelfAchivementPercent"] =
            data.HealthGroupSelfAchivementPercent;

          this.AllocatedData[3]["Health_Group"][i]["EditAllowed"] =
            data.EditAllowed;
          //== HEALTH GROUP END ==//

          //== LIFE RETAIL START ==//
          this.AllocatedData[4]["Life_Retail"][i]["TotalAchivement"] =
            data.LifeRetailTotalAchivement;
          this.AllocatedData[4]["Life_Retail"][i]["NewTotalAchivement"] =
            data.NewLifeRetailTotalAchivement;
          this.AllocatedData[4]["Life_Retail"][i]["AchivementPercent"] =
            data.LifeRetailAchivementPercent;

          this.AllocatedData[4]["Life_Retail"][i]["TotalSelfAchivement"] =
            data.LifeRetailSelfAchivement;
          this.AllocatedData[4]["Life_Retail"][i]["NewTotalSelfAchivement"] =
            data.NewLifeRetailSelfAchivement;
          this.AllocatedData[4]["Life_Retail"][i]["SelfAchivementPercent"] =
            data.LifeRetailSelfAchivementPercent;

          this.AllocatedData[4]["Life_Retail"][i]["EditAllowed"] =
            data.EditAllowed;
          //== LIFE RETAIL END ==//

          //== LIFE RETAIL START ==//
          this.AllocatedData[5]["Life_Group"][i]["TotalAchivement"] =
            data.LifeGroupTotalAchivement;
          this.AllocatedData[5]["Life_Group"][i]["NewTotalAchivement"] =
            data.NewLifeGroupTotalAchivement;
          this.AllocatedData[5]["Life_Group"][i]["AchivementPercent"] =
            data.LifeGroupAchivementPercent;

          this.AllocatedData[5]["Life_Group"][i]["TotalSelfAchivement"] =
            data.LifeGroupSelfAchivement;
          this.AllocatedData[5]["Life_Group"][i]["NewTotalSelfAchivement"] =
            data.NewLifeGroupSelfAchivement;
          this.AllocatedData[5]["Life_Group"][i]["SelfAchivementPercent"] =
            data.LifeGroupSelfAchivementPercent;

          this.AllocatedData[5]["Life_Group"][i]["EditAllowed"] =
            data.EditAllowed;
          //== LIFE RETAIL END ==//

          //== OTHERS START ==//
          this.AllocatedData[6]["Others"][i]["TotalAchivement"] =
            data.OthersTotalAchivement;
          this.AllocatedData[6]["Others"][i]["NewTotalAchivement"] =
            data.NewOthersTotalAchivement;
          this.AllocatedData[6]["Others"][i]["AchivementPercent"] =
            data.OthersAchivementPercent;

          this.AllocatedData[6]["Others"][i]["TotalSelfAchivement"] =
            data.OthersSelfAchivement;
          this.AllocatedData[6]["Others"][i]["NewTotalSelfAchivement"] =
            data.NewOthersSelfAchivement;
          this.AllocatedData[6]["Others"][i]["SelfAchivementPercent"] =
            data.OthersSelfAchivementPercent;

          this.AllocatedData[6]["Others"][i]["EditAllowed"] = data.EditAllowed;
          //== OTHERS END ==//

          //== TOTAL START ==//
          this.AllocatedData[7]["Total"][i]["TotalAchivement"] =
            data.TotalAchivement;
          this.AllocatedData[7]["Total"][i]["NewTotalAchivement"] =
            data.NewTotalAchivement;
          this.AllocatedData[7]["Total"][i]["AchivementPercent"] =
            data.TotalAchivementPercent;

          this.AllocatedData[7]["Total"][i]["TotalSelfAchivement"] =
            data.TotalSelfAchivement;
          this.AllocatedData[7]["Total"][i]["NewTotalSelfAchivement"] =
            data.NewTotalSelfAchivement;
          this.AllocatedData[7]["Total"][i]["SelfAchivementPercent"] =
            data.TotalSelfAchivementPercent;

          this.AllocatedData[7]["Total"][i]["EditAllowed"] = data.EditAllowed;
          this.AllocatedData[7]["Total"][i]["TotalEditAllowed"] =
            data.TotalEditAllowed;
          //== TOTAL END ==//
        });
    }
  }

  //===== GET EMPLOYEE POS TARGET =====//
  GetProfilePosTarget() {
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
        "goal-management-system/ProfilePosTargets/" + this.Url,
        formData
      )
      .then(
        (result: any) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            if (this.UrlSegment == "EmployeeTarget") {
              this.PosData = result["TotalTarget"];
              this.PosTotal = result["TotalPosTarget"];
              this.PosYTD = result["TotalPosYTD"];
              this.PosYTDPercent = result["TotalPosYTDPercent"];

              this.GetProfilePosAchivement();
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

  //===== GET PROFILE ACHIVEMENT IN CHUNKS =====//
  async GetProfilePosAchivement() {
    for (let i = 0; i < this.PosData[0]["PosTarget"].length; i++) {
      var MonthName = this.PosData[0]["PosTarget"][i]["MonthName"];
      var PosTarget = this.PosData[0]["PosTarget"][i]["Value"];
      var ActivePos = this.PosData[1]["ActivePos"][i]["Value"];

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Employee_Id", this.Id);
      formData.append("financial_year", this.financial_year);
      formData.append("MonthName", MonthName);
      formData.append("PosTarget", PosTarget);
      formData.append("ActivePos", ActivePos);
      formData.append("Portal", "CRM");

      var url =
        environment.apiUrlBmsBase +
        "/goal-management-system/LazyCalculations/GetProfilePosAchivementData";

      await this.http
        .post<any>(
          this.api.additionParmsEnc(url),
          this.api.enc_FormData(formData),
          this.api.getHeader(environment.apiUrlBmsBase)
        )
        .toPromise()
        .then((res: any) => {
          var data = JSON.parse(this.api.decryptText(res.response));

          this.PosData[0]["PosTarget"][i]["TotalAchivement"] =
            data.TotalAchivement;
          this.PosData[0]["PosTarget"][i]["AchivementPercent"] =
            data.TotalAchivementPercent;

          this.PosData[1]["ActivePos"][i]["Value"] = data.AllPos;
          this.PosData[1]["ActivePos"][i]["TotalAchivement"] = data.ActivePos;
          this.PosData[1]["ActivePos"][i]["AchivementPercent"] =
            data.ActivePosPercent;
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
        "goal-management-system/AllocatedPosTargets/" + this.Url,
        formData
      )
      .then(
        (result: any) => {
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
        (result: any) => {
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

  //===== Edit TARGET DETAILS =====//
  EditTargetModal(
    TargetValue: any,
    MonthName: any,
    ColumnName: any,
    EditType: any,
    Profile_Type: any
  ): void {
    var CorelineTarget = this.AllocatedData[0]["Motor"];
    if (this.Coreline == "Non Motor") {
      CorelineTarget = this.AllocatedData[1]["Non_Motor"];
    } else if (this.Coreline == "Health") {
      CorelineTarget = this.AllocatedData[2]["Health-Retail"];
    } else if (this.Coreline == "Life") {
      CorelineTarget = this.AllocatedData[4]["Life-Retail"];
    }

    const dialogRef = this.dialog.open(EditTargetComponent, {
      width: "25%",
      height: "45%",
      disableClose: true,
      data: {
        EmployeeId: this.Id,
        TargetValue: TargetValue,
        MonthName: MonthName,
        ColumnName: ColumnName,
        EditType: EditType,
        ProfileType: Profile_Type,
        IsSales: this.Is_Sales,
        Sequence: this.Sequence,
        AllocatedData: this.AllocatedData[0]["Motor"],
        CorelineTarget: CorelineTarget,
        TotalTarget: this.AllocatedData[7]["Total"],
        Coreline: this.Coreline,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.Is_Refresh == "Yes") {
        this.Is_Refresh = "Yes";
        this.GetEmployeeAllocatedBusinessTarget();
        this.GetAllocatedPosTarget();

        if (this.Is_Sales == 1) {
          this.GetEmployeeProfileBusinessTarget();
          this.GetProfilePosTarget();
        }
      }
    });
  }
}
