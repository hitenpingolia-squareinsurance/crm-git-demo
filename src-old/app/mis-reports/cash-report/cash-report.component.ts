import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import swal from "sweetalert";
import { CreateMisReportNameComponent } from "../../modals/create-mis-report-name/create-mis-report-name.component";

class ColumnsObj {
  Id: string;
  isSelected: any;
  SR_No: string;
  LOB_Name: string;
  File_Type: string;
  Customer_Name: string;
  Agent_Name: string;
  RM_Name: string;
  UW_Name: string;
  Operation_Name: string;
  Account_Name: string;
  Estimated_Gross_Premium: string;
  Add_Stamp: string;
  SR_Current_Status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  totalSRandBussinessCount: any[];
  totalPremium: any[];
  SQL_Where: any;
}

@Component({
  selector: "app-cash-report",
  templateUrl: "./cash-report.component.html",
  styleUrls: ["./cash-report.component.css"],
})
export class CashReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  isSubmitted = false;
  masterSelected: boolean;

  TotalNetPremium: number = 0.0;
  TotalBookedPremium: number = 0.0;
  TotalUnBookedPremium: number = 0.0;

  TotalSR: number = 0;
  TotalBookedSR: number = 0;
  TotalUnBookedSR: number = 0;

  TotalCancelledSR: number = 0;
  TotalCancelledNetPremium: number = 0;
  TotalCancelledRevenue: number = 0;

  TotalRevenue: number = 0;
  TotalBookedRevenue: number = 0;
  TotalUnBookedRevenue: number = 0;

  SQL_Where_STR: any;

  Percentage_Slot: any = 0;
  Is_Prepre_Excel: any = 0;
  Export_Id: any = 0;
  Limits: any = [];

  ReportTypeDisable = true;
  reportTypeVal: any = "";

  obsevableResponseArray: Array<any> = [];
  UpdatedStatus: any = "";
  Remark: any = "";

  BusinessLine_Ar: Array<any>;
  Vertical_Ar: Array<any>;
  Service_Location_Ar: Array<any>;
  Emps_Ar: Array<any>;
  ReportTypeData: Array<any>;

  Agents_Ar: Array<any>;
  Companies_Ar: Array<any>;
  Products_Ar: Array<any>;
  Is_Export: any = 0;

  SRLOB_Ar: any = [];
  SRStatus_Ar: any = [];
  SRSource_Ar: any = [];
  SRType_Ar: any = [];
  SR_Payout_Mode_Ar: any = [];
  SR_Posting_Status_Ar: any = [];
  UserRights: any = [];
  checkedList: any = [];

  UpdatedStatus_Ar: any = [];

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsmultiselect1: any = {};
  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: any = {};

  ItemEmployeeSelection: any = [];
  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";

  ItemVerticalSelection: any;
  ItemLOBSelection: any = [];

  currentUrl: string;
  urlSegment: string;

  hasAccess: boolean = true;
  errorMessage: string = '';

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Business_Line_Id: [""],
      Vertical_Id: [""],
      Service_Location_Id: [""],
      Emp_Id: [""],
      RM_Search_Type: [""],
      Agent_Id: [""],
      SRLOB: [""],
      Product_Id: [""],
      Company_Id: [""],
      SRStatus: ["", [Validators.required]],
      SR_Source_Type: [""],
      SR_Type: [""],
      SR_Payout_Mode: [""],
      SR_Posting_Status: [""],
      DateOrDateRange: [""],
      searchval: [""],
    });

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsmultiselect1 = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
    };

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
    };

    this.ReportTypeData = [
      { Id: "Self", Name: "Self" },
      { Id: "Team", Name: "Team" },
    ];

    this.SRLOB_Ar = [
      { Id: "Motor", Name: "Motor" },
      { Id: "Non Motor", Name: "Non Motor" },
      { Id: "Health", Name: "Health" },
      { Id: "Life Fresh", Name: "Life Fresh" },
      { Id: "Life Renewal", Name: "Life Renewal" },
      { Id: "Travel", Name: "Travel" },
      { Id: "Personal Accident", Name: "Personal Accident" },
    ];

    this.SRStatus_Ar = [
      { Id: "Logged", Name: "Logged" },
      { Id: "Complete", Name: "Booked" },
      { Id: "Pending", Name: "UnBooked" },
      { Id: "Cancelled", Name: "Cancelled" },
    ];

    this.SRSource_Ar = [
      { Id: "BMS", Name: "Offline" },
      { Id: "Web", Name: "Online" },
      { Id: "Excel", Name: "Excel" },
    ];

    this.SRType_Ar = [
      { Id: "Normal", Name: "Normal" },
      { Id: "Endorsement", Name: "Endorsement" },
      { Id: "Short", Name: "Short" },
      { Id: "Recovery", Name: "Recovery" },
      { Id: "Extra-Payout", Name: "Extra Reward" },
    ];

    this.SR_Payout_Mode_Ar = [
      { Id: "Advance", Name: "Daily" },
      { Id: "Weekly", Name: "Weekly" },
      { Id: "Monthly", Name: "Monthly" },
    ];

    this.SR_Posting_Status_Ar = [
      { Id: "0", Name: "PendingForPosting" },
      { Id: "1", Name: "PendingForAccounts" },
      { Id: "2", Name: "RejectByAccounts" },
      { Id: "3", Name: "PendingForBanking" },
      { Id: "4", Name: "RejectByBanking" },
      { Id: "5", Name: "Approved" },
      { Id: "6", Name: "Paid/PayoutTransferred" },
    ];

    var selectedItemsSR_Status = [{ Id: "Logged", Name: "Logged" }];
    this.SearchForm.get("SRStatus").setValue(selectedItemsSR_Status);

    this.UpdatedStatus_Ar = [
      { Id: 1, Name: "Approve" },
      { Id: 2, Name: "Cancel" },
    ];
  }

  ngOnInit(): void {
    //Check Url Segment
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    this.Get();
    this.SearchComponentsData();
  }

  get FC() {
    return this.SearchForm.controls;
  }

  checkUncheckAll() {
    for (var i = 0; i < this.dataAr.length; i++) {
      this.dataAr[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.dataAr.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.dataAr.length; i++) {
      if (this.dataAr[i].isSelected) {
        this.checkedList.push({ Id: this.dataAr[i].Id });
      }
    }
    //this.checkedList = JSON.stringify(this.checkedList);
    this.checkedList = this.checkedList;
    // console.log(this.checkedList);
  }

  //===== SEARCH COMPONENT DATA =====//
  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "common/Common/SearchComponentsData?User_Code=" +
          this.api.GetUserData("Code") +
          "&Portal=CRM&PageName=64VB-Report"
      )
      .then(
        (result:any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.BusinessLine_Ar = result["Data"]["Business_Line_Ar"];
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.Service_Location_Ar = result["Data"]["Region_Ar"];
            this.Companies_Ar = result["Data"]["Ins_Compaines"];
            this.UserRights = result["Data"]["SR_User_Rights"];
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
        }
      );
  }

  //===== GET VERTICAL DATA =====//
  GetVerticalData() {
    this.Emps_Ar = [];
    this.SearchForm.get("Emp_Id").setValue("");

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "64VB-Report");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "Business_Line_Id",
      JSON.stringify(this.SearchForm.value["Business_Line_Id"])
    );

    this.api.HttpPostTypeBms("/common/Common/GetVerticalData", formData).then(
      (result:any) => {
        if (result["Status"] == true) {
          this.Vertical_Ar = result["Data"];
        } else {
          this.api.Toast("Warning", result["Message"]);
          this.SearchForm.get("Vertical_Id").setValue("");
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

  //===== GET EMPLOYEES DATA =====//
  GetEmployees() {
    this.Emps_Ar = [];
    this.Agents_Ar = [];
    this.SearchForm.get("Emp_Id").setValue("");
    this.SearchForm.get("Agent_Id").setValue("");

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "64VB-Report");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "Vertical_Id",
      JSON.stringify(this.SearchForm.value["Vertical_Id"])
    );
    formData.append(
      "Service_Location_Id",
      JSON.stringify(this.SearchForm.value["Service_Location_Id"])
    );
    formData.append("Sub_Region_Id", "");

    this.api.HttpPostTypeBms("/common/Common/GetEmployees", formData).then(
      (result:any) => {
        if (result["Status"] == true) {
          this.Emps_Ar = result["Data"];
        } else {
          this.api.Toast("Warning", result["Message"]);
          this.SearchForm.get("Emp_Id").setValue("");
          this.Emps_Ar = [];
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

  //SET REPORT TYPE
  SetReportType() {
    this.reportTypeVal = "";
    this.GetAgents("0");
  }

  //===== GET AGENTS DATA =====//
  GetAgents(e: any) {
    this.Agents_Ar = [];
    this.SearchForm.get("Agent_Id").setValue("");

    const formData = new FormData();

    if (this.SearchForm.get("Emp_Id").value.length == 1) {
      this.ReportTypeDisable = false;
      if (e == "1") {
        this.reportTypeVal = [{ Id: "Self", Name: "Self" }];
      }
    } else {
      this.ReportTypeDisable = true;
      this.SearchForm.get("RM_Search_Type").setValue("");
      this.reportTypeVal = "";
    }

    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("Portal", "CRM");
    formData.append("Agent_Type", "");
    formData.append(
      "Report_Type",
      JSON.stringify(this.SearchForm.value["RM_Search_Type"])
    );
    formData.append("RM_Ids", JSON.stringify(this.SearchForm.value["Emp_Id"]));

    this.api.HttpPostTypeBms("/common/Common/GetAgents", formData).then(
      (result:any) => {
        if (result["Status"] == true) {
          this.Agents_Ar = result["Data"];
        } else {
          this.Agents_Ar = [];
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast(
          "Error",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  //===== GET PRODUCTS =====//
  GetProducts() {
    const formData = new FormData();
    formData.append("LOB", JSON.stringify(this.SearchForm.value["SRLOB"]));

    this.api.HttpPostTypeBms("reports/CashReport/GetProducts", formData).then(
      (result:any) => {
        if (result["Status"] == true) {
          this.Products_Ar = result["Products_Ar"];
          this.Companies_Ar = result["Company_Ar"];
        } else {
          this.api.Toast("Warning", result["Message"]);
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

  //===== SEARCH DATA =====//
  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;

      var DateOrDateRange = fields["DateOrDateRange"];
      var ToDate, FromDate;

      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      var query = {
        Role: this.api.GetUserData("UserType_Name"),

        Business_Line_Id: fields["Business_Line_Id"],
        Vertical_Id: fields["Vertical_Id"],
        Service_Location_Id: fields["Service_Location_Id"],

        Emp_Id: fields["Emp_Id"],
        RM_Search_Type: fields["RM_Search_Type"],
        Agent_Id: fields["Agent_Id"],

        LOB: fields["SRLOB"],
        Product_Id: fields["Product_Id"],
        Company_Id: fields["Company_Id"],

        Source: fields["SR_Source_Type"],
        SR_Type: fields["SR_Type"],
        SR_Status: fields["SRStatus"],

        SR_Payout_Mode: fields["SR_Payout_Mode"],
        SR_Posting_Status: fields["SR_Posting_Status"],
        SearchValue: fields["searchval"],

        To_Date: this.api.StandrdToDDMMYYY(ToDate),
        From_Date: this.api.StandrdToDDMMYYY(FromDate),
      };

      this.Is_Export = 0;
      this.dataAr = [];
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
        //this.Is_Export = 1;
      });
    }
  }

  //===== CLEAR FILTER FORM =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.SearchForm.get("Business_Line_Id").setValue("");
    this.SearchForm.get("Vertical_Id").setValue("");
    this.SearchForm.get("Service_Location_Id").setValue("");
    this.SearchForm.get("Emp_Id").setValue("");
    this.SearchForm.get("RM_Search_Type").setValue("");
    this.SearchForm.get("Agent_Id").setValue("");
    this.SearchForm.get("SRLOB").setValue("");
    this.SearchForm.get("Product_Id").setValue("");
    this.SearchForm.get("Company_Id").setValue("");
    this.SearchForm.get("SR_Source_Type").setValue("");

    this.SearchForm.get("SR_Type").setValue("");
    this.SearchForm.get("SR_Payout_Mode").setValue("");
    this.SearchForm.get("SR_Posting_Status").setValue("");

    var selectedItemsSR_Status = [{ Id: "Logged", Name: "Logged" }];
    this.SearchForm.get("SRStatus").setValue(selectedItemsSR_Status);

    this.Emps_Ar = [];
    this.Agents_Ar = [];

    this.Employee_Placeholder = "Select Employee";
    this.Agents_Placeholder = "Select Agent";

    this.ItemVerticalSelection = [];
    this.ItemEmployeeSelection = [];
    this.ItemLOBSelection = [];

    this.dataAr = [];
    this.ResetDT();

    this.Is_Export = 0;
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== GET DATATABLE DATA =====//
  Get() {
    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {

        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/reports/CashReport/GridData?User_Code=" +
                this.api.GetUserData("Code") +
                "&Portal=CRM" +
                "&PageType=" +
                this.urlSegment
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;

            that.dataAr = resp.data;
            this.checkedList = [];
            //that.TotalNetPremium = resp.totalSRandBussinessCount['TotalPremium'];
            //that.TotalSR = resp.totalSRandBussinessCount['TotalSR'];

            that.TotalSR = resp.totalPremium["TotalSR"];
            that.TotalBookedSR = resp.totalPremium["TotalBookedSR"];
            that.TotalUnBookedSR = resp.totalPremium["TotalUnBookedSR"];

            that.TotalNetPremium = resp.totalPremium["TotalPremium"];
            that.TotalBookedPremium = resp.totalPremium["TotalBookedPremium"];
            that.TotalUnBookedPremium =
              resp.totalPremium["TotalUnBookedPremium"];

            that.TotalCancelledSR = resp.totalPremium["TotalCancelledSR"];
            that.TotalCancelledNetPremium =
              resp.totalPremium["TotalCancelledNetPremium"];
            that.TotalCancelledRevenue =
              resp.totalPremium["TotalCancelledRevenue"];

            that.TotalRevenue = resp.totalPremium["TotalRevenue"];
            that.TotalBookedRevenue = resp.totalPremium["TotalBookedRevenue"];
            that.TotalUnBookedRevenue =
              resp.totalPremium["TotalUnBookedRevenue"];

            that.SQL_Where_STR = resp.SQL_Where;
            //alert(resp.SQL_Where);
            if (that.dataAr.length > 0) {
              that.Is_Export = 1;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
          (err) => {
            // Error log
            this.api.HideLoading();
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
      },

      // columns: [
      //   { data: "Id" },
      //   { data: "SR_No" },
      //   { data: "LOB_Name" },
      //   { data: "Customer_Name" },
      //   { data: "Agent_Name" },
      //   { data: "RM_Name" },
      //   { data: "Estimated_Gross_Premium" },
      // ],

      // columnDefs: [
      //   {
      //     targets: [0, 1, 2, 3, 4, 5], // column index (start from 0)
      //     orderable: false, // set orderable false for selected columns
      //   },
      // ],
    };
  }

  //===== CANCEL STATUS UPDATE =====//
  CancelStatusUpdate() {
    this.Reload();
    this.masterSelected = false;
    this.checkedList = [];
  }

  //===== UPDATE SR STATUS =====//
  async UpdateStatus() {
    const Is_Confirm = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to change status of this data?",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
    });

    if (Is_Confirm) {
      const formData = new FormData();

      formData.append("Portal", "CRM");
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("Status", JSON.stringify(this.UpdatedStatus));
      formData.append("Remark", this.Remark);
      formData.append("checkedList", JSON.stringify(this.checkedList));

      for (var i = 0; i < this.checkedList.length; i++) {
        formData.append("Sr_Ids[]", this.checkedList[i]["Id"]);
      }

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms("reports/CashReport/UpdateStatus", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.Reload();
              this.masterSelected = false;
              this.checkedList = [];
            } else {
              this.api.Toast("Error", result["Message"]);
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    } else {
      this.Reload();
      this.masterSelected = false;
      this.checkedList = [];
    }
  }

  //===== SR POPUP =====//
  SrPopup(type: any, row_Id: any, Lob: any): void {
    var UrlType = "general-insurance";
    if (Lob == "LI" || Lob == "Life") {
      UrlType = "life-insurance";
    }

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Code"));
    formData.append("Source", "CRM");

    this.api
      .HttpPostTypeBms("../v2/sr/life/LifeSubmit/GetUserId", formData)
      .then(
        (result:any) => {
          if (result["Status"] == true) {
            //var baseurl = 'http://localhost:4000/';
            // var baseurl = 'https://uat.policyonweb.com/';
            var baseurl = "https://crm.squareinsurance.in/";
            var url =
              baseurl +
              "business-login/form/" +
              UrlType +
              "/" +
              type +
              "/crm/" +
              result["User_Id"] +
              "/" +
              row_Id;
            window.open(url, "", "fullscreen=yes");
          } else {
            this.api.Toast("Error", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again! " + err.message
          );
        }
      );
  }

  ExportExcel(): void {
    const dialogRef = this.dialog.open(CreateMisReportNameComponent, {
      width: "70%",
      height: "70%",
      //disableClose : true,
      data: { SQL_Where: this.SQL_Where_STR },
    });
    this.Is_Export = 0;
    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }
}
