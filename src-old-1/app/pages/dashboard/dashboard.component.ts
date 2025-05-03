import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DetailsRmBoxComponent } from "../details-rm-box/details-rm-box.component";
import { empty } from "rxjs";
import { ViewDashboardPoupupComponent } from "../../modals/view-dashboard-poupup/view-dashboard-poupup.component";
import { currentId } from "async_hooks";
import { UpdateProjectionTargetComponent } from "../../modals/projection-target/update-projection-target/update-projection-target.component";
import { Console } from "console";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  [x: string]: any;

  PetInsurance: FormGroup;

  images = [
    { url: "assets/image/slide-1.png", alt: "Image 1" },
    { url: "assets/image/slide-2.png", alt: "Image 2" },
  ];

  Dataarr: any = [];
  dataResult: any = [];
  DashboardValue: any = [];
  UnderTrainingAgentResult: any = [];
  AgentTrainingType: any = [];
  Dataarr1: any;
  DashboardValue1: any;
  LoginType: string;
  Life_Training_Status: any;
  PosStatus: string;
  FetchData: any;
  RmData: any;
  TeleRmData: any;
  LoginId: any;
  TotalLObGraph: any = 0;
  TotalPolicyGraph: any;
  PolicyChartLabels: string[];
  RevenueChartLabels: string[];
  TotalRevenueGraph: any;
  OnlineQuotes: any = 0;
  OnlineQuoteConverted: any = 0;
  OnlineQuoteRatio: any = 0;

  ShowLoaderQuoteRatio: string = "No";
  ShowLoaderPolicyGraph: string = "No";
  ShowLoaderLobGraph: string = "No";
  ShowLoaderEarningGraph: string = "No";
  ViewKnowledgeBaseData: any;
  OfflineQuotes: any = 0;
  OfflineQuoteConverted: any = 0;
  OfflineQuoteRatio: any = 0;
  TotalConversionRatio: any = 0;
  EarningTransfered: any = 0;
  EarningPending: any = 0;
  EarningTotal: any = 0;
  dataArrayOnlineQuote: any = 0;
  DataDashboard: any = [];
  DepartmentIdLoginUser: any;
  Ops_Data_Dashboard: string;
  OpsCurrentDay: any;
  OpsLastDay: any;
  currentIndex = 0;
  intervalId: any;
  transitionEnabled = true;
  UpcomingEvents: any;

  isSubmitted = false;
  showOtpInput = false;
  otp: any;
  Partner: any;
  //----------Projection overview---------------
  isTodayActive: boolean = true;
  TodayType: boolean = false;
  SelfTarget: number;
  PreviousMonthTarget: number;
  SelfAchivementPercent: number;
  LastAchievementPercent: number;
  PercentageChange: number;
  PercentageChange1: number;
  Abspercent: number;
  Abspercent1: number;
  today_target: number;
  yesterday_target: number;
  IsUpdate: any = "No";

  //------------------projection overview end------------

  // PolicyChartData: { data: any; label: string; }[];
  // RevenueChartData: { data: any; label: string; }[];

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.PetInsurance = this.fb.group({
      name: ["", [Validators.required, Validators.pattern]],
      mobile: ["", [Validators.required, Validators.pattern]],
      city: ["", [Validators.required, Validators.pattern]],
      otp: [""],
    });
  }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  public PolicyChartType = "bar";
  public RevenueChartType = "bar";

  public barChartLegend = false;

  public pieChartLabels = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  pieChartLabels2 = ["1", "2", "3", "4", "5", "6", "7"];
  pieChartData = [0, 0, 0, 0, 0, 0, 0];
  pieChartType = "pie";

  ngOnInit() {
    this.Partner = this.api.GetUserData("Partner");
    this.GetUserDataType = this.api.GetUserType();
    this.startAutoSlide();
    this.DataDashboard = [];

    this.Life_Training_Status = 1;

    this.GetDashBoardEmployeeWise(516);
    this.GetDashBoardEmployeeWise(517);
    this.GetDashBoardEmployeeWise(518);
    this.GetDashBoardEmployeeWise(519);
    this.GetDashBoardEmployeeWise(520);
    this.GetDashBoardEmployeeWise(521);
    this.GetDashBoardEmployeeWise(522);
    this.GetDashBoardEmployeeWise(523);

    this.SquareData();
    this.BMSData();

    this.LobGraph();
    this.PolicyGraph();
    this.EarningGraph();
    this.QuotesRatio();

    this.GetKnowledgeBaseDetails();
    // console.log(this.api.GetPosType());

    this.LoginType = this.api.GetUserType();
    this.LoginId = this.api.GetUserData("Id");
    this.DepartmentIdLoginUser = this.api.GetUserData("department");
    this.loginName = this.api.GetUserData("Name");
    this.loginEmail = this.api.GetUserData("Email");
    //   //   //   console.log(this.api.GetUserData("Name"));

    if (
      this.LoginType == "user" &&
      (this.loginName == "" || this.loginName == undefined) &&
      (this.loginEmail == "" || this.loginEmail == undefined)
    ) {
      document.getElementById("clickbtn").click();
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    //   //   //   console.log(this.DepartmentIdLoginUser);
    // this.DepartmentIdLoginUser = 10;
    if (this.DepartmentIdLoginUser == 10) {
      this.OperationCurrentDayPerformanceReport(Date(), "CurrentDay");
      this.OperationCurrentDayPerformanceReport(yesterday, "Yesterday");
    }

    if (this.LoginType == "agent") {
      this.GetRmTeleRmDetails();

      this.PosStatus = this.api.GetUserData("pos_status");
      this.Life_Training_Status = this.api.GetUserData("Life_Training_Status");

      if (this.PosStatus == "2") {
        this.Life_Training_Status = this.Life_Training_Status;
      }
    }

    if (this.LoginType != "user") {
      this.CheckUpdateAvailability();
    }
    this.GetEvent();
    this.GetDashboardData();
    //alert(btoa('Life'));
  }

  //------------------------------Projection target data------------------------//

  GetDashboardData(currentMonth: boolean = true) {
    this.isTodayActive = currentMonth;

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    let startDate: string;
    let endDate: string;
    const now = new Date();

    if (currentMonth) {
      this.TodayType = true;

      endDate = now.toISOString().split("T")[0];
      const start = new Date();
      start.setUTCFullYear(now.getUTCFullYear());
      start.setUTCMonth(now.getUTCMonth());
      start.setUTCDate(1);
      startDate = start.toISOString().split("T")[0];

      //   //   //   console.log(startDate + "........" + endDate);
    } else {
      const lastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );

      const end = new Date(lastMonth);
      end.setUTCFullYear(lastMonth.getUTCFullYear());
      end.setUTCMonth(lastMonth.getUTCMonth());
      end.setUTCDate(now.getDate());
      endDate = end.toISOString().split("T")[0];

      const start = new Date(lastMonth);
      start.setUTCFullYear(lastMonth.getUTCFullYear());
      start.setUTCMonth(lastMonth.getUTCMonth());
      start.setUTCDate(1);
      startDate = start.toISOString().split("T")[0];

      //   //   //   console.log(startDate + "........" + endDate);
    }

    const that = this;
    this.http
      .post(
        this.api.additionParmsEnc(
          environment.apiUrlBmsBase +
            "/projection-target/ProjectionTarget/GetPreviousLog2?&User_type=" +
            this.api.GetUserType() +
            "&User_Id=" +
            this.api.GetUserData("Id") +
            "&Portal=CRM" +
            "&StartDate=" +
            startDate +
            "&EndDate=" +
            endDate +
            "&TodayType=" +
            this.TodayType
        ),
        {},
        this.api.getHeader(environment.apiUrlBmsBase)
      )
      .subscribe((res: any) => {
        var resp = JSON.parse(this.api.decryptText(res.response));

        this.dataResult = resp.data;

        this.GetDataInChanks(startDate, endDate, this.TodayType);
      });
  }

  // //===== GET DATA IN CHUNKS =====//

  async GetDataInChanks(startDate: string, endDate: string, TodayType: any) {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("Portal", "CRM");
    if (this.isTodayActive == true) {
      formData.append("Type", "Today");
    } else {
      formData.append("Type", "Month");
    }

    // formData.append("StartDate", startDate);
    // formData.append("EndDate", endDate);
    // formData.append("TodayType", TodayType);

    var url =
      environment.apiUrlBmsBase +
      "/projection-target/ProjectionTarget/GetDataInChanksDashboard";
    await this.http
      .post(
        this.api.additionParmsEnc(url),
        this.api.enc_FormData(formData),
        this.api.getHeader(environment.apiUrlBmsBase)
      )
      .toPromise()
      .then((res: any) => {
        var resp = JSON.parse(this.api.decryptText(res.response));

        // if(this.isTodayActive == true){
        this.SelfTarget = resp.SelfTargetCurrent;
        this.SelfAchivementPercent = resp.SelfAchivementPercentCurrent;
        this.LastAchievementPercent = resp.SelfAchivementPercentLast;
        this.yesterday_target = resp.SelfTargetLast;
        this.SelfBusinessCurrent = resp.SelfBusinessCurrent;
        this.SelfTargetLast = resp.SelfTargetLast;

        // }else{
        //   this.SelfTarget = resp.SelfTargetCurrent;
        //   this.SelfAchivementPercent = resp.SelfAchivementPercentCurrent;
        //   this.LastAchievementPercent = resp.SelfAchivementPercentLast;
        //   this.yesterday_target = resp.SelfTargetLast;
        // }

        // this.SelfTarget = resp.SelfTargetCurrent;
        // this.SelfAchivementPercent = resp.SelfAchivementPercentCurrent;
        // this.LastAchievementPercent = resp.SelfAchivementPercentLast;

        // if(!this.isTodayActive){
        // this.PreviousMonthTarget = resp.SelfTargetLast;
        // }
        // // if(this.TodayType = true){
        //   this.today_target = resp.SelfTargetCurrent;
        //   this.yesterday_target = resp.SelfTargetLast;
        // // }
      });

    // this.PercentageChange = resp.PercentageChange;
    // this.PercentageChange1 = resp.PercentageChange1;
    // this.Abspercent = Math.abs(this.PercentageChange);
    // this.Abspercent1 = Math.abs(this.PercentageChange1);

    // 'SelfTargetCurrent' => $this->CommonModel->GetTargetString($SelfTargetCurrent),
    // 'SelfBusinessCurrent' => $this->CommonModel->GetTargetString(round($SelfBusinessCurrent)),
    // 'SelfAchivementPercentCurrent' => round($SelfAchievementPercentCurrent, 2),

    // 'SelfTargetLast' => $this->CommonModel->GetTargetString($SelfTargetlast),
    // 'SelfBusinessLast' => $this->CommonModel->GetTargetString(round($SelfBusinesslast)),
    // 'SelfAchivementPercentLast' => round($SelfAchievementPercentlast, 2),
  }

  showToday() {
    this.isTodayActive = true;
    this.GetDashboardData(true);
  }

  showLastMonth() {
    this.isTodayActive = false;
    this.GetDashboardData(false);
  }
  //-----------------------------updateprojectionmodel-----------------//

  CheckUpdateAvailability() {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api
      .HttpPostTypeBms(
        "projection-target/ProjectionTarget/CheckUpdateAvailability",
        formData
      )
      .then(
        (result: any) => {
          if (result["Status"] == true) {
            this.IsUpdate = result["IsUpdate"];
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  update_projection(): void {
    const dialogRef = this.dialog.open(UpdateProjectionTargetComponent, {
      width: "30%",
      height: "48%",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.Is_Refresh == "Yes") {
        this.CheckUpdateAvailability();
        this.GetDashboardData();
      }
    });
  }

  //------------------Projection Target Data End------------//

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.slideNext();
    }, 5000); // Change image every 3 seconds
  }

  shouldShowJoinButton(eventDate: string): boolean {
    const halfHour = 30 * 60 * 1000;
    const currentDate = new Date();
    const [startDate, endDate] = eventDate
      .split(" to ")
      .map((dateStr) => new Date(dateStr));
    return startDate.getTime() - currentDate.getTime() <= halfHour;
  }

  slideNext(): void {
    if (this.currentIndex === this.images.length) {
      this.transitionEnabled = false;
      this.currentIndex = 0;
      setTimeout(() => {
        this.transitionEnabled = true;
        this.currentIndex++;
      }, 50); // Allow some time to reset without transition
    } else {
      this.currentIndex++;
    }
  }

  getTransform(): string {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  getTransition(): string {
    return this.transitionEnabled ? "transform 0.5s ease-in-out" : "none";
  }

  get formControls() {
    return this.PetInsurance.controls;
  }

  OperationCurrentDayPerformanceReport(Date: any, Day) {
    const formData = new FormData();

    this.Ops_Data_Dashboard = "";
    // this.LoginId = 211;
    formData.append("User_Id", this.LoginId);
    formData.append("User_Type", this.LoginType);
    if (Day == "CurrentDay") {
      formData.append("OpsEmpId", this.LoginId);
    }
    formData.append("Date", Date);
    formData.append("Day", Day);

    this.api.IsLoading();
    this.api
      .HttpPostType("TodayDashboard/GetOperationRightsEmployee", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            if (Day == "CurrentDay") {
              this.OpsCurrentDay = result["Data"];
            }

            if (Day == "Yesterday") {
              this.OpsLastDay = result["Data"];
            }

            // this.OpsRmData = result["OpsRmData"];
            // this.TeleRmData = result["TeleRmData"];
          } else {
            this.api.Toast("Warning", result["msg"]);
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

  CheckStatusLife() {
    throw new Error("Method not implemented.");
  }

  UpDateOperationDepartmentPerformance() {}

  RedirectToWEbs(Url) {
    var UserDatas = this.api.GetUserData("Id");
    var GetUserType = this.api.GetUserType();

    // alert( UserDatas);
    // alert( GetUserType);
    // return false;
    let a = document.createElement("a");
    a.target = "_blank";

    if (GetUserType == "employee") {
      a.href =
        this.api.ReturnWebUrl() +
        "/redirecting-session-users/" +
        GetUserType +
        "/" +
        btoa(UserDatas) +
        "?ReturnUrl=" +
        Url;

      // a.href =
      //   this.api.ReturnWebUrl() +
      //   "/Prequotes/SetSessionEmployee/login/" +
      //   btoa(UserDatas) +
      //   "?ReturnUrl=" +
      //   Url;
    } else {
      if (GetUserType == "user") {
        GetUserType = "agent";
      }

      a.href =
        this.api.ReturnWebUrl() +
        "/redirecting-session-users/" +
        GetUserType +
        "/" +
        btoa(UserDatas) +
        "?ReturnUrl=" +
        Url;

      // a.href =
      //   this.api.ReturnWebUrl() +
      //   "/agents/check/" +
      //   btoa(UserDatas) +
      //   "/" +
      //   btoa(GetUserType) +
      //   "/login?ReturnUrl=" +
      //   Url;
    }

    // a.href = Url;

    // alert(a);
    // return false;
    a.click();
  }

  BMSData() {
    //  return false;
    this.api.IsLoading();

    this.api
      .HttpGetSOCKET_ENDPOINT(
        "Reports/" +
          this.api.GetUserData("Id") +
          "/" +
          this.api.GetUserType() +
          "/Bms"
      )
      .then(
        (result) => {
          var data = JSON.parse(
            this.api.decryptText(JSON.parse(result[0].body).response)
          );
          if (data.status == 1) {
            this.api.HideLoading();

            this.Dataarr = data.data;
            //   //   //   console.log(this.Dataarr);
          } else {
            this.api.Toast("Warning", data.msg);
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

  SquareData() {
    this.api.IsLoading();
    this.api
      .HttpGetSOCKET_ENDPOINT(
        "Reports/" +
          this.api.GetUserData("Id") +
          "/" +
          this.api.GetUserType() +
          "/Web"
      )
      .then(
        (result) => {
          var data = JSON.parse(
            this.api.decryptText(JSON.parse(result[0].body).response)
          );

          if (data.status == 1) {
            this.api.HideLoading();

            // console.log(data.data);
            this.Dataarr1 = data.data;
            this.DashboardValue = data.Dashboard;
            this.UnderTrainingAgentResult = data.ResultAgent;
            this.AgentTrainingType = data.ResultAgent;

            if (this.api.GetDashboardLoginPoupup() == "1") {
              if (
                this.api.GetUserType() == "agent" &&
                this.api.GetUserData("pos_status") == 2 &&
                this.Life_Training_Status == "0"
              ) {
                // this.ViewDashboardPoupup();
              }
            }

            if (result["Redirect"] == "ExamStart") {
              this.router.navigate([
                "Agent/ExamStart/" + btoa(this.AgentTrainingType),
              ]);
            } else if (result["Redirect"] == "Training") {
              this.router.navigate([
                "Agent/Training/" + btoa(this.AgentTrainingType),
              ]);
            } else if (result["Redirect"] == "ExamResult") {
              this.router.navigate([
                "Agent/ExamResult/" + btoa(this.AgentTrainingType),
              ]);
            }
          } else {
            this.api.HideLoading();
            this.api.Toast("Warning", data.msg);
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

  Clicks(Type: any, Result: any) {
    if (Result != null || (Result != "" && Type != "")) {
      this.router.navigate(["Agent/ExamResult/" + btoa(Type)]);
    } else if (Result == null || (Result == "" && Type != "")) {
      this.router.navigate(["Agent/ExamStart/" + btoa(Type)]);
    }
  }

  Clicks2(Type: any, TrainingType: any) {
    this.router.navigate(["Agent/Training/" + btoa(TrainingType)]);
  }

  Logout() {
    this.router.navigate(["Logoutweb"]);
  }

  GetRmDetails(): void {
    var id = this.api.GetUserData("Id");

    // // console.log(id);/

    const dialogRef = this.dialog.open(DetailsRmBoxComponent, {
      width: "40%",
      height: "40%",
      disableClose: true,

      data: { Id: id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }

  ViewDashboardPoupup(): void {
    const dialogRef = this.dialog.open(ViewDashboardPoupupComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      localStorage.setItem("LoadingDashboardPoupup", "0");
    });
  }

  GetRmTeleRmDetails() {
    const formData = new FormData();

    formData.append("User_Id", this.LoginId);
    formData.append("User_Type", this.LoginType);

    this.api.IsLoading();

    this.api.HttpPostType("MyPos/GetRmTeleRmDetails", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          this.FetchData = result["Data"];
          this.RmData = result["RmData"];
          this.TeleRmData = result["TeleRmData"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  LobGraph() {
    const formData = new FormData();

    formData.append("User_Id", this.LoginId);
    formData.append("User_Type", this.LoginType);

    this.api.IsLoading();

    this.api
      .HttpGetSOCKET_ENDPOINT(
        "Dashboard/" +
          this.api.GetUserData("Id") +
          "/" +
          this.api.GetUserType() +
          "/Lob"
      )
      .then(
        (result) => {
          var data = JSON.parse(
            this.api.decryptText(JSON.parse(result[0].body).response)
          );

          if (data.status == 1) {
            this.api.HideLoading();

            this.TotalLObGraph = data.TotalCount;
            var newDataId = data.data.split(",");
            var newDataValue = data.DataValue.split(",");
            this.pieChartLabels2 = newDataValue;
            this.pieChartData = newDataId;
          } else {
            this.api.Toast("Warning", data.msg);
            this.api.HideLoading();
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

  EarningGraph() {
    const formData = new FormData();
    this.ShowLoaderEarningGraph = "Yes";
    this.api.IsLoading();

    formData.append("User_Id", this.LoginId);
    formData.append("User_Type", this.LoginType);

    this.api
      .HttpGetSOCKET_ENDPOINT(
        "Dashboard/" +
          this.api.GetUserData("Id") +
          "/" +
          this.api.GetUserType() +
          "/Revenue"
      )
      .then(
        (result) => {
          var data = JSON.parse(
            this.api.decryptText(JSON.parse(result[0].body).response)
          );

          if (data.status == 1) {
            this.ShowLoaderEarningGraph = "No";

            this.TotalRevenueGraph = data.TotalCount;
            var newDataIdRevenue = data.data.split(",");
            var newDataValueRevenue = data.DataValue.split(",");
            this.RevenueChartLabels = newDataValueRevenue;

            this.RevenueChartData = [
              { data: newDataIdRevenue, label: "Revenue" },
            ];

            this.api.HideLoading();
          } else {
            this.api.Toast("Warning", data.msg);
            this.api.HideLoading();
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

  PolicyGraph() {
    this.api.IsLoading();

    const formData = new FormData();

    formData.append("User_Id", this.LoginId);
    formData.append("User_Type", this.LoginType);

    // this.api.IsLoading();
    this.api
      .HttpGetSOCKET_ENDPOINT(
        "Dashboard/" +
          this.api.GetUserData("Id") +
          "/" +
          this.api.GetUserType() +
          "/Policy"
      )
      .then(
        (result) => {
          var data = JSON.parse(
            this.api.decryptText(JSON.parse(result[0].body).response)
          );

          if (data.status == 1) {
            // this.api.HideLoading();

            this.ShowLoaderPolicyGraph = "No";

            this.TotalPolicyGraph = data.TotalCount;
            var newDataIdPolicy = data.data.split(",");
            var newDataValuePolicy = data.DataValue.split(",");

            this.PolicyChartLabels = newDataValuePolicy;
            this.PolicyChartData = [
              { data: newDataIdPolicy, label: "Monthly Business" },
            ];
            this.api.HideLoading();
          } else {
            this.ShowLoaderPolicyGraph = "No";

            this.api.Toast("Warning", data.msg);
            this.api.HideLoading();
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

  QuotesRatio() {
    const formData = new FormData();
    this.api.IsLoading();

    formData.append("User_Id", this.LoginId);
    formData.append("User_Type", this.LoginType);

    // this.api.IsLoading();
    this.api
      .HttpGetSOCKET_ENDPOINT(
        "Dashboard/" +
          this.api.GetUserData("Id") +
          "/" +
          this.api.GetUserType() +
          "/Quote"
      )
      .then(
        (result) => {
          var data = JSON.parse(
            this.api.decryptText(JSON.parse(result[0].body).response)
          );

          if (data.status == 1) {
            // this.api.HideLoading();
            this.OnlineQuotes = data.OnlineQuotes;
            this.OnlineQuoteConverted = data.OnlineQuoteConverted;
            this.OnlineQuoteRatio = data.OnlineQuoteRatio;

            this.OfflineQuotes = data.OfflineQuotes;
            this.OfflineQuoteConverted = data.OfflineQuoteConverted;
            this.OfflineQuoteRatio = data.OfflineQuoteRatio;

            this.TotalConversionRatio = data.TotalConversionRatio;

            this.dataArrayOnlineQuote = data.Data;

            this.GetEarning();

            this.api.HideLoading();
          } else {
            this.api.Toast("Warning", data.msg);
            this.api.HideLoading();
          }
        },
        (err) => {
          // this.api.HideLoading();
          this.api.HideLoading();

          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  GetEarning() {
    this.api.IsLoading();

    const formData = new FormData();
    formData.append("UserId", this.api.GetUserData("Id"));
    formData.append("UserType", this.api.GetUserType());
    formData.append("dashboard_status", "1");

    //crm.squareinsurance.in/backuplivelife/api/dashboard/Earningvalucehek/17564/agent?User_Id=54&User_Type=employee
    https: this.api.IsLoading();
    this.api
      .HttpGetType(
        "dashboard/Earningvalucehek/" +
          this.api.GetUserData("Id") +
          "/" +
          this.api.GetUserType() +
          "?User_Id=54&User_Type=employee"
      )
      .then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == 1) {
            this.EarningTransfered = result["Transfferd"];
            this.EarningPending = result["Pending"];
            this.EarningTotal = result["Total"];
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  //ACCEPT REQUEST
  GetKnowledgeBaseDetails() {
    this.api.IsLoading();

    const formData = new FormData();
    formData.append("UserId", this.api.GetUserData("Id"));
    formData.append("UserType", this.api.GetUserType());
    formData.append("dashboard_status", "1");

    this.api.IsLoading();
    this.api
      .HttpPostType("KnowledgeBase/ViewKnowledgeBaseDetails", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            // this.api.Toast("Success", result["msg"]);
            this.ViewKnowledgeBaseData = result["data"];
            // this.Reload();
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  public PolicyChartData = [
    { data: [0, 1, 2, 3, 4, 5, 6, 7], label: "Monthly Business" },
  ];

  public RevenueChartData = [
    { data: [0, 1, 2, 3, 4, 5, 6, 7], label: "Revenue" },
  ];

  GetDashBoardEmployeeWise(Id: any) {
    this.api
      .HttpGetType(
        "Dashboard/GetDashBoardEmployeeWise?Id=" +
          Id +
          "&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&Type=Claim"
      )
      .then(
        (result: any) => {
          //this.api.HideLoading();
          if (result["status"] == true) {
            if (result["Data"] != "") {
              this.DataDashboard = this.DataDashboard.concat(result["Data"]);

              // this.DataDashboard = this.DataDashboard.concat();

              // this.DataDashboard.push(result["Data"]);
            }
            //this.api.Toast('Success',result['msg']);
            // this.DataDashboard = this.DataDashboard.concat();

            // this.DataDashboard.push(result["Data"]);
          } else {
            //alert(result['message']);
            //this.api.Toast('Warning',result['msg']);
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

  // yuvraj code
  convertToProperCase(text: string): string {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  GetEvent() {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    this.api.IsLoading();
    this.api.HttpPostType("Event/UpcomingEvents", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.UpcomingEvents = result["data"];
          // console.log(this.UpcomingEvents.length)
        } else {
          this.UpcomingEvents = [];
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
  openUrl(url: any): void {
    window.open(url, "_blank");
  }
  CopyText(inputElement) {
    this.api.CopyText(inputElement);
    // navigator.clipboard.writeText(inputElement);
  }

  // Submit_data(){
  //   this.isSubmitted = true;
  //   if (this.PetInsurance.controls.name.valid && this.PetInsurance.controls.mobile.valid && this.PetInsurance.controls.city.valid) {
  //     this.showOtpInput = true;

  //     var fields = this.PetInsurance.value;
  //     const formData = new FormData();
  //     formData.append("Login_User_Type", this.api.GetUserType());
  //     formData.append("Login_User_Id", this.api.GetUserData("Id"));
  //     formData.append("name", fields["name"]);
  //     formData.append("mobile", fields["mobile"]);
  //     formData.append("city", fields["city"]);
  //     formData.append("typeval", 'otp');

  //     this.http.post(environment.apiUrl + "/PetInsurance/PetInsuranceForm", formData)
  //     .subscribe((data: any) => {
  //    //   //   //   console.log(data);

  //           this.api.Toast("Success", 'Otp Sent Successfully');

  //       }, (error: any) => {
  //      //   //   //   console.log(error);
  //     });

  //   } else {
  //     this.showOtpInput = false;
  //   }

  //   if (this.PetInsurance.invalid) {
  //     return;
  //   } else {
  //  //   //   //   console.log('123');
  // }
  // }

  Otp_Field_open() {
    //   //   //   console.log(this.showOtpInput);
    const otp = this.PetInsurance.get("otp");

    if (this.showOtpInput == true) {
      otp.setValidators(Validators.required);
    } else {
      otp.setValidators(null);
    }

    otp.updateValueAndValidity();
  }

  RestForm() {
    this.PetInsurance.reset();
    this.showOtpInput = false;
    this.Otp_Field_open();
  }

  Submit_data() {
    this.isSubmitted = true;
    if (this.PetInsurance.invalid) {
      return;
    } else {
      var fields = this.PetInsurance.value;

      var fields = this.PetInsurance.value;
      const formData = new FormData();

      formData.append("Login_User_Type", this.api.GetUserType());
      formData.append("Login_User_Id", this.api.GetUserData("Id"));
      formData.append("name", fields["name"]);
      formData.append("mobile", fields["mobile"]);
      formData.append("city", fields["city"]);
      // formData.append("typeval", 'otp');
      // console.log(formData);

      // // console.log('formData');
      this.api.IsLoading();
      this.api.HttpPostType("PetInsurance/PetInsuranceForm", formData).then(
        (result: any) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.showOtpInput = true;

            this.Otp_Field_open();
            this.api.Toast("Success", result["msg"]);

            // this.router.navigate(["Mypos/View-Docs"]);
          } else {
            this.showOtpInput = false;
            document.getElementById("close_pop").click();

            this.RestForm();
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }

  verifyOtp() {
    this.isSubmitted = true;
    if (this.PetInsurance.invalid) {
      return;
    } else {
      var fields = this.PetInsurance.value;

      var fields = this.PetInsurance.value;
      const formData = new FormData();

      formData.append("Login_User_Type", this.api.GetUserType());
      formData.append("Login_User_Id", this.api.GetUserData("Id"));

      formData.append("mobile", fields["mobile"]);
      formData.append("otp", fields["otp"]);
      // formData.append("typeval", 'otp');
      // console.log(formData);

      // // console.log('formData');
      this.api.IsLoading();
      this.api.HttpPostType("PetInsurance/VerifyOtp", formData).then(
        (result: any) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.showOtpInput = true;

            this.Otp_Field_open();
            this.RestForm();
            document.getElementById("close_pop").click();
            this.api.Toast("Success", result["msg"]);

            // this.router.navigate(["Mypos/View-Docs"]);
          } else {
            this.showOtpInput = true;
            this.Otp_Field_open();
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }
}
