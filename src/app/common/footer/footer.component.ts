import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../providers/api.service";
import { HttpClient } from "@angular/common/http";
import { PusherService } from "../../providers/pusher.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent implements OnInit {
  selectedOption: string;
  PrimeStatus: string;
  GemsStatus: string;
  employee: any;
  data: any;
  MonthlyRevenue: any = [];
  MonthlyBusiness: any = [];
  YearlyBusiness: any = [];
  YearlyRevenue: any = [];
  target_data: any = [];
  dataNew: any = [];
  isVisible = 0;

  POSP_targets: any = [];
  Totalss_POSP: any = [];
  reneweds_nosp: any = [];
  result: any;
  PageType: any;
  User_Code: any;
  currentDate: any;
  wish: any;
  WhatsNewData: any;
  LoginType: string | null;
  isBirthdayTabActive: any;
  openDashboard: number = 0;
  currentYear: number;
  mergedArray: any;
  constructor(
    private http: HttpClient,
    public api: ApiService,
    private pusherService: PusherService,
    private router: Router
  ) {
    this.currentYear = new Date().getFullYear();

    this.LoginType = this.api.GetUserType();
  }

  ngOnInit() {
    this.selectedOption = "Team";
    this.GetPrimeStatus();
    this.GetGemsStatus();
    this.date();
  }
  openBirthdayPage(Id: any) {
    if (Id == 0) {
      this.openDashboard = 1;
    } else {
      this.openDashboard = 0;
    }
    if (this.openDashboard == 1) {
      const birthdayTab = document.getElementById("pills-home-tab");

      if (birthdayTab) {
        birthdayTab.click();
      }
    }
  }

  date() {
    const date = new Date();
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1);
    const year = date.getFullYear();

    this.currentDate = `${day}-${month}-${year}`;
  }
  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  GetPrimeStatus() {
    if (
      this.api.GetUserType() == "agent" &&
      this.api.GetUserData("pos_status") == 2
    ) {
      this.PrimeStatus = this.api.GetPrimeStatus();
    }
  }

  isSameDateAndMonth(itemDate: any): boolean {
    const itemDateTime = new Date(itemDate);
    const currentDateTime = new Date();

    return (
      itemDateTime.getDate() === currentDateTime.getDate() &&
      itemDateTime.getMonth() === currentDateTime.getMonth()
    );
  }

  GetGemsStatus() {
    if (
      this.api.GetUserType() == "agent" &&
      this.api.GetUserData("pos_status") == 2
    ) {
      this.GemsStatus = this.api.GetGemsStatus();
    }
  }

  wishesdata_employee() {
    this.wishesdata();
    this.api.HttpGetType("Dashboard/wishesdata_employee").then(
      (response: any) => {
        if (response.status == 1) {
          if (response.msg != "") {
            this.employee = response.data.employee;
          }
        } else {
          this.employee = '';
          // this.api.Toast("Warning", response.msg);
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
  wishesdata() {
    this.api.HttpGetType("Dashboard/wishesdata").then(
      (response: any) => {
        if (response["status"] == 1) {
          if (response["data"] != "") {
            this.wish = response["data"];
            this.mergeAndSortArrays();
          }
        } else {
          this.wish = '';
          this.mergeAndSortArrays();
          // this.api.Toast("Warning", response["msg"]);
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
  isHidden(item): boolean {
    return item.isHidden;
  }
  // Function to toggle the visibility of the item
  toggleVisibility(item): void {
    item.isHidden = !item.isHidden;
  }
  sendEmail(itemId: any, type: any) {
    // console.log(type
    this.api
      .HttpGetType(`Dashboard/SendWisheEmail?meenid=${itemId}&type=${type}`)
      .then(
        (response: any) => {
          if (response.status == 1) {
            this.api.Toast("Success", response.msg);
          } else {
            this.api.Toast("Warning", response.msg);
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

  Dashboard_data(PageType_data: any) {
    this.PageType = PageType_data;

    this.dataNew = [];
    this.MonthlyBusiness = [];

    this.MonthlyRevenue = [];

    this.YearlyBusiness = [];

    this.YearlyRevenue = [];
    this.target_data = [];
    this.POSP_targets = [];
    this.Totalss_POSP = [];
    this.reneweds_nosp = [];
    // alert(this.PageType);
    this.User_Code = this.api.GetUserData("Code");
    this.isVisible = 1;
    this.getValueEdit();
    this.achievements("MonthlyBusiness");
    this.achievements("MonthlyRevenue");
    this.achievements("YearlyBusiness");
    this.achievements("YearlyRevenue");
    this.target();
    this.POSP_target();
    this.Totals_posp();
    this.renewed_nosp();
  }

  getValueEdit() {
    const formData = new FormData();
    formData.append("Employee_Id", this.User_Code);
    formData.append("Type", "DashboardData");

    this.api.IsLoading();

    this.api
      .HttpForSR(
        "post",
        "../../v1/projection-target/ProjectionTarget/GetDataInChanks",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.dataNew = result;
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

  achievements(SectionType) {
    const formData = new FormData();

    formData.append("Emp_Id", this.User_Code);
    formData.append("Report_Type", this.PageType);
    formData.append("SectionType", SectionType);

    this.api.IsLoading();

    this.api
      .HttpForSR("post", "../../v1/AppBusinessApi/IndexNew", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result.Status == true) {
            if (SectionType == "MonthlyBusiness") {
              this.MonthlyBusiness = result;
            }
            if (SectionType == "MonthlyRevenue") {
              this.MonthlyRevenue = result;
            }
            if (SectionType == "YearlyBusiness") {
              this.YearlyBusiness = result;
            }
            if (SectionType == "YearlyRevenue") {
              this.YearlyRevenue = result;
            }
          } else {
            this.api.Toast("Warning", result.msg);
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
  POSP_target() {
    const formData = new FormData();
    // formData.append("Employee_Id", this.api.GetUserData('Code'));

    formData.append("EmployeeId", this.User_Code);
    formData.append("ReportType", this.PageType);
    this.api.IsLoading();

    this.api
      .HttpForSR("post", "../../v1/pms/PosAcquisition/Index", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.POSP_targets = result;
            // console.log(this.POSP_targets);
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
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

  Totals_posp() {
    const formData = new FormData();
    // formData.append("Employee_Id", this.api.GetUserData('Code'));

    formData.append("User_Code", this.User_Code);
    formData.append("PageType", this.PageType);
    formData.append("Login_User_Type", "employee");
    formData.append("Login_User_Id", "54");
    formData.append("url", "/mis-reports/active-inactive-pos");

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "V2/PosActivationReport/fetchActiveInactiveReportData2?User_Code=" +
        this.User_Code +
        "&PageType=" +
        this.PageType +
        "&url=/mis-reports/active-inactive-pos&Action=''"
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result !== null && result !== undefined) {
            this.Totalss_POSP = result;
            // console.log(this.Totalss_POSP);
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
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

  renewed_nosp() {
    const formData = new FormData();
    // formData.append("Employee_Id", this.api.GetUserData('Code'));
    formData.append("User_Code", this.User_Code);
    formData.append("PageType", this.PageType);

    this.api.IsLoading();
    // this.api.HttpGetType("api/V2/PosActivationReport/GirdData?User_Code=SIB304&PageType=" + this.api.GetUserData('Id') + "&User_Code=" + this.api.GetUserData('Code') + "&User_Type=" + this.api.GetUserType()).then(
    this.api
      .HttpGetType(
        "V2/PosActivationReport/GirdData?User_Code=" +
        this.User_Code +
        "&PageType=" +
        this.PageType +
        "&Device_Type=App&platForm=Web"
      )
      .then((result: any) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.reneweds_nosp = result["FilterData"][0];
          // console.log(this.reneweds_nosp);
        } else {
          const msg = "msg";
          this.api.Toast("Warning", result["msg"]);
        }
      });
  }

  target() {
    const formData = new FormData();
    // formData.append("Employee_Id", this.api.GetUserData('Code'));
    formData.append("EmployeeId", this.User_Code);
    formData.append("ReportType", this.PageType);

    this.api.IsLoading();

    this.api.HttpForSR("post", "../../v1/pms/PmsAppAPI/Index", formData).then(
      // this.http
      //   .post("https://api.policyonweb.com/API/v1/pms/PmsAppAPI/Index", formData)
      //   .subscribe(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.target_data = result;
        } else {
          const msg = "msg";
          this.api.Toast("Warning", result["msg"]);
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

  WhatsNewDataGet() {
    this.WhatsNewData = [];
    const formData = new FormData();
    formData.append("user_code", this.api.GetUserData("Code"));

    this.api.HttpPostTypeBms("../v2/pay-in/WhatsNew", formData).then(
      (result: any) => {
        if (result["Status"] == true) {
          this.WhatsNewData = result["Data"];
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast(
          "Warning",
          "Network Error, Please try again ! " + err.message
        );
      }
    );
  }





  mergeAndSortArrays() {
    if (this.wish.length > 0 && this.employee.length > 0) {
      this.mergedArray = [...this.employee, ...this.wish]
        .sort((a, b) => {
          const dateA = new Date(a.dob);
          const dateB = new Date(b.dob);

          const monthDiff = dateA.getMonth() - dateB.getMonth();
          if (monthDiff !== 0) {
            return monthDiff;
          }

          return dateA.getDate() - dateB.getDate();
        });
    }
    else {
      if(this.wish.length > 0){
        this.mergedArray=this.wish;
      }
      else{
        this.mergedArray=this.employee;
      }
    }
    // console.log(this.mergedArray)
  }



}
