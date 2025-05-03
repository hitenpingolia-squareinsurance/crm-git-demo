import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

import { LifeRenewalActionComponent } from "../../modals/life-renewal-action/life-renewal-action.component";
import { LifeRenewalsTrackComponent } from "../../modals/life-renewals-track/life-renewals-track.component";
import { UpdatePaymentFrequencyComponent } from "../../modals/life-renewals/update-payment-frequency/update-payment-frequency.component";

class ColumnsObj {
  Request_Type: string;
  isSelected: any;
  Track_Id: any;
  Id: string;
  Step_Id: string;
  Agent_Id: any;
  Posting_Status_Web: any;
  SR_No: string;
  Add_Stamp: string;
  LI_Status: any;
  LOB_Name: string;
  Segment_Id: string;
  Product_Id: string;
  SubProduct_Id: string;
  Agent_Name: string;
  RM_Name: string;
  ShowAction: string;
  Policy_Issuance_Date: string;
  Estimated_Gross_Premium: string;
  Net_Premium: string;
  Renewal_Date: string;
  LI_Payment_Frequency: string;
  LI_Proposer_Type: string;
  Renewal_Status: string;
  Lapsed_Days: string;
  ChangePayFrequency: string;
  RenewalYear: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  PostingCountAr: any;
  SQL_Where: any;
  FilterData: any[];
  RenewalQuery: any[];
  TotalRes: any;
  TotalPremium: any;
  TotalPending: any;
  TotalPendingPremium: any;
  TotalRenewed: any;
  TotalRenewedPremium: any;
  TotalLost: any;
  TotalLostPremium: any;
}

@Component({
  selector: "app-life-renewals",
  templateUrl: "./life-renewals.component.html",
  styleUrls: ["./life-renewals.component.css"],
})
export class LifeRenewalsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  UserId: number = this.api.GetUserData("Id");

  ActivePage: string = "Default";
  ActiveTab: any = 1;
  statusType: string = "";

  SearchForm: FormGroup;
  isSubmitted = false;

  DisableMonthField = false;
  DisableStatusField = false;

  ShowDateFilter: any = "No";
  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  Companies_Ar: Array<any>;
  Products_Ar: Array<any>;
  AccountsUser_Ar: Array<any>;
  Months_Ar: Array<any>;
  Status_Ar: Array<any>;
  SrStatusValue: Array<any>;
  RenewalPeriod_Ar: Array<any>;
  SelectedRenewalPeriod: Array<any>;

  SRAgentType_Ar: any = [];
  SRLOB_Ar: any = [];
  SRStatus_Ar: any = [];
  SRType_Ar: any = [];
  SRSource_Ar: any = [];
  SR_Payout_Status_Ar: any = [];

  vertical_dropdownSettings: any = {};
  dropdownSettings: any = {};

  AgentdropdownSettings: any = {};
  LOB_dropdownSettings: any = {};
  dropdownSettingsSingle: any = {};

  ItemVerticalSelection: any = [];
  ItemEmployeeSelection: any = [];
  ItemLOBSelection: any = [];

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select POS";

  DisableNextMonth: any;

  Assign_User: any = "";
  Remark: any = "";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];
  CurrentMonth: any = "";
  Name: any = "";
  SelectedCurrentMonth: any = [];
  SelectedCurrentStatus: any = [];
  MonthRenewal: any = [];
  FilterDatatype: any;

  maxDate = new Date();
  minDate = new Date();

  SQL_Where_STR: any;
  TotalRes: any;
  TotalPremium: any;
  TotalPending: any;
  TotalPendingPremium: any;
  TotalRenewed: any;
  TotalRenewedPremium: any;
  TotalLost: any;
  TotalLostPremium: any;

  Is_Export: any = 0;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Vertical_Id: ["0"],
      Region_Id: ["0"],
      Sub_Region_Id: ["0"],
      Emp_Id: [""],
      SRAgent_Type: [""],
      Agent_Id: [""],
      Product_Id: [""],
      Company_Id: [""],
      SRLOB: [""],
      CurrentUser_Id: [""],
      SRStatus: [""],
      SRType: [""],
      SR_Source_Type: [""],
      GlobalSearch: [""],
      DateOrDateRange: [""],
      Month_Name: [""],
      Renewal_Period: [""],
      Status: [""],
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.AgentdropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.LOB_dropdownSettings = {
      singleSelection: false,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };

    this.dropdownSettingsSingle = {
      singleSelection: true,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
      allowSearchFilter: false,
    };

    this.SRSource_Ar = [
      { Id: "BMS", Name: "Offline" },
      { Id: "Web", Name: "Online" },
      { Id: "Excel", Name: "Excel" },
    ];
    this.RenewalPeriod_Ar = [
      { Id: "Due", Name: "Dues" },
      { Id: "Grace", Name: "Grace" },
      { Id: "Lapsed", Name: "Lapsed" },
    ];
    this.SelectedRenewalPeriod = [{ Id: "Due", Name: "Dues" }];

    this.Status_Ar = [
      { Id: "All", Name: "All" },
      { Id: "0", Name: "Pending" },
      { Id: "1", Name: "Complete" },
    ];
    this.SelectedCurrentStatus = [{ Id: "All", Name: "All" }];

    this.Months_Ar = [
      { Id: "01", Name: "January" },
      { Id: "02", Name: "Feburary" },
      { Id: "03", Name: "March" },
      { Id: "04", Name: "April" },
      { Id: "05", Name: "May" },
      { Id: "06", Name: "June" },
      { Id: "07", Name: "July" },
      { Id: "08", Name: "August" },
      { Id: "09", Name: "September" },
      { Id: "10", Name: "October" },
      { Id: "11", Name: "November" },
      { Id: "12", Name: "December" },
    ];

    //Month Related Filter Values
    const d = new Date();
    this.CurrentMonth = d.getMonth();
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    //Month String Value
    this.Name = month[d.getMonth()];

    //Month Numeric Value
    this.CurrentMonth = +this.CurrentMonth + +1;
    if (this.CurrentMonth < 11) {
      this.CurrentMonth = "0" + this.CurrentMonth;
    }

    this.SelectedCurrentMonth = [{ Id: this.CurrentMonth, Name: this.Name }];

    this.minDate.setDate(this.minDate.setFullYear(2001));
    this.maxDate.setDate(this.maxDate.getDate() - this.maxDate.getDate());
  }

  ngOnInit(): void {
    if (this.router.url == "/business-management/premium-due") {
      this.ActivePage = "Premium_Due";
    } else if (this.router.url == "/business-management/renewal_pending") {
      this.ActivePage = "Renewal_Pending";
    } else if (this.router.url == "/business-management/renewals") {
      this.ActivePage = "Renewals";
    } else {
      alert("Unkown URI Segment");
    }

    this.FilterData();
    this.Get(1);
    this.FilterDataGetMonthRenewal();
  }

  Accept(e) {}

  CancelSrStatus(e) {}

  ChangeStatus(e) {}

  //===== GET MONTH RENEWAL =====//
  FilterDataGetMonthRenewal() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api.HttpForSR("post", "Renewal/GetMonthRenewal", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.MonthRenewal = result["Data"];
          // console.log(this.MonthRenewal);
          // console.log(12345678);
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

  //===== FORM CONTROLS VALIDATION =====//
  get FC() {
    return this.SearchForm.controls;
  }

  //===== FILTER FIELDS DATA =====//
  FilterData() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "reports/BussinessReport/SearchComponentsData?Page=Claim&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Code=" +
          this.api.GetUserData("Code") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.Companies_Ar = result["Data"]["Ins_Compaines"];
            this.Region_Ar = result["Data"]["Region_Ar"];
            this.AccountsUser_Ar = result["Data"]["AccountsUser"];
          } else {
            //alert(result['message']);
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

  //===== ENABLE / DISABLE MONTH FILTER =====//
  EnableDisableMonthFilter(Type: any) {
    //== Renewal Period ==//
    if (Type == "Renewal Period") {
      this.SearchForm.get("DateOrDateRange").setValue("");
      var Value = this.SearchForm.value["Renewal_Period"];

      if (Value.length == 1 && Value[0]["Id"] == "Due") {
        this.DisableMonthField = false;
        this.DisableStatusField = false;
        this.SelectedCurrentMonth = [
          { Id: this.CurrentMonth, Name: this.Name },
        ];
        this.SelectedCurrentStatus = [{ Id: "All", Name: "All" }];

        this.SearchForm.get("Month_Name").setValidators([Validators.required]);
        this.SearchForm.get("Month_Name").updateValueAndValidity();
      } else {
        this.DisableMonthField = true;
        this.DisableStatusField = true;
        this.SelectedCurrentMonth = [];
        this.SelectedCurrentStatus = [];

        this.SearchForm.get("Month_Name").setValidators(null);
        this.SearchForm.get("Month_Name").setValue("");
        this.SearchForm.get("Month_Name").updateValueAndValidity();
      }

      //== Date ==//
    } else if (Type == "Date") {
      this.DisableMonthField = true;
      this.SelectedCurrentMonth = [];

      this.SearchForm.get("Month_Name").setValidators(null);
      this.SearchForm.get("Month_Name").setValue("");
      this.SearchForm.get("Month_Name").updateValueAndValidity();
    }
  }

  //===== ON ITEM SELECT =====//
  onItemSelect(item: any, Type: any) {
    //Type is Vertical
    if (Type == "Vertical") {
      this.Emps_Ar = [];
      this.Agents_Ar = [];

      this.ItemVerticalSelection.push(item.Id);
    }

    //Type is Employee
    if (Type == "Employee") {
      this.Agents_Ar = [];

      this.ItemEmployeeSelection.push(item.Id);
      this.GetAgents("OneByOneSelect");
    }

    //Type is LOB
    if (Type == "LOB") {
      this.ItemLOBSelection.push(item.Id);
      if (item.Id == "LI" && this.ItemLOBSelection.length == 1) {
        this.statusType = "Life";
      } else {
        this.statusType = "";
      }
      //this.GetProducts('OneByOneSelect');
      this.GetInsCompany("OneByOneSelect");
    }
  }

  //===== ON ITEM DeSELECT =====//
  onItemDeSelect(item: any, Type: any) {
    if (Type == "Vertical") {
      this.Emps_Ar = [];
      this.Agents_Ar = [];

      var index = this.ItemVerticalSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemVerticalSelection.splice(index, 1);
      }
      // console.log(this.ItemVerticalSelection);
    }

    if (Type == "Employee") {
      this.Agents_Ar = [];

      var index = this.ItemEmployeeSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemEmployeeSelection.splice(index, 1);
      }
      // console.log(this.ItemEmployeeSelection);
      this.GetAgents("OneByOneDeSelect");
    }

    if (Type == "LOB") {
      var index = this.ItemLOBSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemLOBSelection.splice(index, 1);
      }
      // console.log(this.ItemLOBSelection[0])
      if (item.Id == "LI") {
        this.statusType = "";
      } else if (
        this.ItemLOBSelection.length == 1 &&
        this.ItemLOBSelection[0] == "LI"
      ) {
        this.statusType = "Life";
      }
      //this.GetProducts('OneByOneDeSelect');
      this.GetInsCompany("OneByOneSelect");
    }
  }

  //===== GET EMPLOYEES =====//
  GetEmployees() {
    this.Emps_Ar = [];
    this.Agents_Ar = [];

    this.SearchForm.get("Emp_Id").setValue(null);
    this.SearchForm.get("Agent_Id").setValue(null);

    const formData = new FormData();
    //formData.append('User_Id',this.api.GetUserData('Id'));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("User_Type", this.api.GetUserType());
    //formData.append('Type',Type);
    formData.append("Vertical_Id", this.SearchForm.value["Vertical_Id"]);
    formData.append("Region_Id", this.SearchForm.value["Region_Id"]);
    formData.append("Sub_Region_Id", this.SearchForm.value["Sub_Region_Id"]);

    this.api
      .HttpPostType("reports/BussinessReport/GetEmployees", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Emps_Ar = result["Data"];
            this.Employee_Placeholder =
              "Select Employee (" + this.Emps_Ar.length + ")";
            this.Agents_Placeholder = "Select Agent";
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

  //===== GET SUB BRANCHES =====//
  GetSubBranches(e) {
    this.GetEmployees();

    this.SearchForm.get("Sub_Region_Id").setValue("0");

    var Branch_Id = e.target.value;

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "reports/BussinessReport/GetSubBranches?Branch_Id=" +
          Branch_Id +
          "&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Sub_Branch_Ar = result["Data"];
          } else {
            //alert(result['Message']);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //alert(err.message);
        }
      );
  }

  //===== GET AGENTS =====//
  GetAgents(Type) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("RM_Ids", this.ItemEmployeeSelection.join());
    this.api.HttpPostType("reports/BussinessReport/GetAgents", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Agents_Ar = result["Data"];
          this.Agents_Placeholder =
            "Select Agents (" + this.Agents_Ar.length + ")";
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

  //===== GET PRODUCTS =====//
  GetProducts(Type) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", JSON.stringify(this.SearchForm.value["SRLOB"]));
    this.api.HttpPostType("reports/BussinessReport/GetProducts", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Products_Ar = result["Data"];
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

  //===== GET INSURANCE COMPANY ACCORDING LOB =====//
  GetInsCompany(Type) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", JSON.stringify(this.SearchForm.value["SRLOB"]));
    this.api
      .HttpPostType("reports/BussinessReport/GetInsCompany", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Companies_Ar = result["Data"];
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

  //===== SET ACTIVE TAB =====//
  SetActiveTab(ActiveTab: any) {
    this.ActiveTab = ActiveTab;
    this.SearchBtn();
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;

      //Date Filter Validation
      if (fields["Request_Type"] == 1) {
        this.SearchForm.get("DateOrDateRange").setValidators([
          Validators.required,
        ]);
      } else {
        this.SearchForm.get("DateOrDateRange").setValidators(null);
      }
      this.SearchForm.get("DateOrDateRange").updateValueAndValidity();

      var DateOrDateRange = fields["DateOrDateRange"];
      var ToDate, FromDate;
      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      var query = {
        User_Id: this.api.GetUserData("Id"),
        User_Type: this.api.GetUserType(),

        Vertical_Id: fields["Vertical_Id"],
        Region_Id: fields["Region_Id"],
        Sub_Region_Id: fields["Sub_Region_Id"],

        Emp_Id: fields["Emp_Id"],
        SRAgent_Type: fields["SRAgent_Type"],
        Agent_Id: fields["Agent_Id"],

        LOB: fields["SRLOB"],
        Product_Id: fields["Product_Id"],
        Company_Id: fields["Company_Id"],

        //CurrentUser_Id : fields['CurrentUser_Id'],
        Source: fields["SR_Source_Type"],
        SR_Status: fields["SRStatus"],
        Request_Type: fields["Request_Type"],
        SR_Type: fields["SRType"],
        Renewal_Period: fields["Renewal_Period"],
        Month_Name: fields["Month_Name"],
        Status: fields["Status"],
        GlobalSearch: fields["GlobalSearch"],
        ActiveTab: this.ActiveTab,

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
        this.Is_Export = 0;
      });
    }
  }

  //===== CLEAR SEARCH FORM =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.SearchForm.get("Vertical_Id").setValue("0");
    this.SearchForm.get("Region_Id").setValue("0");
    this.SearchForm.get("Sub_Region_Id").setValue("0");
    this.SearchForm.get("DateOrDateRange").setValue("");

    this.SelectedRenewalPeriod = [{ Id: "Due", Name: "Dues" }];
    this.SelectedCurrentMonth = [{ Id: this.CurrentMonth, Name: this.Name }];
    this.SelectedCurrentStatus = [{ Id: "All", Name: "All" }];

    this.Emps_Ar = [];
    this.Agents_Ar = [];
    this.Products_Ar = [];

    this.Employee_Placeholder = "Select Employee";
    this.Agents_Placeholder = "Select Agent";

    this.ItemVerticalSelection = [];
    this.ItemEmployeeSelection = [];
    this.ItemLOBSelection = [];

    this.dataAr = [];
    this.Reload();

    this.Is_Export = 0;
  }

  //===== RELOAD PAGE =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== GET DATATABLE DATA =====//
  Get(ActiveTab: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    const that = this;
    this.api.IsLoading();
    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [10, 25, 50, 100],
      pageLength: 10,
      //searching: false,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBms +
                "/GridData/Renewals_Datatable?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&ActiveTab=" +
                ActiveTab
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            that.TotalRes = resp.TotalRes;
            that.TotalPremium = resp.TotalPremium;
            that.TotalPending = resp.TotalPending;
            that.TotalPendingPremium = resp.TotalPendingPremium;
            that.TotalRenewed = resp.TotalRenewed;
            that.TotalRenewedPremium = resp.TotalRenewedPremium;
            that.TotalLost = resp.TotalLost;
            that.TotalLostPremium = resp.TotalLostPremium;

            this.api.HideLoading();

            that.SQL_Where_STR = resp.SQL_Where;
            if (that.dataAr.length > 0) {
              that.Is_Export = 1;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      //columns: [
      //		{ data: 'Id' },
      //		{ data: 'Type' }

      //]

      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4, 5, 6], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }

  //===== VIEW DOCUMENTS =====//
  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  //===== SR POPUP =====//
  SrPopup(type: any, row_Id: any): void {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Code"));
    formData.append("Source", "CRM");

    this.api
      .HttpPostTypeBms("../v2/sr/life/LifeSubmit/GetUserId", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            var baseurl = "https://crm.squareinsurance.in/";
            var url =
              baseurl +
              "business-login/form/life-insurance/" +
              type +
              "/crm/" +
              result["User_Id"] +
              "/" +
              row_Id +
              "/web";
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

  //===== UPDATE SR RENEWAL DETAILS MODAL =====//
  UpdateRenewalAction(row_Id: any, Track_Id: any): void {
    const dialogRef = this.dialog.open(LifeRenewalActionComponent, {
      width: "35%",
      height: "50%",
      data: { Id: row_Id, Track_Id: Track_Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  //===== VIEW RENEWAL TRACK MODAL =====//
  ViewRenewalTrack(row_Id: any): void {
    const dialogRef = this.dialog.open(LifeRenewalsTrackComponent, {
      width: "55%",
      height: "50%",
      data: { Id: row_Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  //===== VIEW RENEWAL TRACK MODAL =====//
  UpdatePaymentFrequency(row_Id: any, RenewalYear: any): void {
    const dialogRef = this.dialog.open(UpdatePaymentFrequencyComponent, {
      width: "35%",
      height: "60%",
      data: { Id: row_Id, RenewalYear: RenewalYear },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }
}
