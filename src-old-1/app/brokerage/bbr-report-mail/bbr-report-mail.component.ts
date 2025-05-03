import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { BmsapiService } from "../../providers/bmsapi.service";
import { Router } from "@angular/router";
import swal from "sweetalert";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

import { AdminSRCancelComponent } from "../../modals/brokerage/admin-srcancel/admin-srcancel.component";
import { SrEditByRightComponent } from "../../modals/brokerage/sr-edit-by-right/sr-edit-by-right.component";
import { DownloadingViewBmsComponent } from "src/app/modals/brokerage/downloading-view-bms/downloading-view-bms.component";
import { EditsrpayoutComponent } from "../../modals/brokerage/editsrpayout/editsrpayout.component";
import { BrokrageRequestLoaderComponent } from "../../modals/brokerage/brokrage-request-loader/brokrage-request-loader.component";

class ColumnsObj {
  Id: string;
  isSelected: any;
  SR_No: string;
  LOB_Name: string;
  File_Type: string;
  Customer_Name: string;
  Agent_Id: string;
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
  selector: "app-bbr-report-mail",
  templateUrl: "./bbr-report-mail.component.html",
  styleUrls: ["./bbr-report-mail.component.css"],
})
export class BbrReportMailComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  isSubmitted = false;

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

  obsevableResponseArray: Array<any> = [];

  Departments_Ar: Array<any>;

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  Companies_Ar: Array<any>;
  Products_Ar: Array<any>;
  Bussiness_Months_Ar: Array<any>;
  Is_Export: any = 0;

  SRLOB_Ar: any = [];
  SRStatus_Ar: any = [];
  SRSource_Ar: any = [];
  SR_Payout_Mode_Ar: any = [];
  SR_Posting_Status_Ar: any = [];
  UserRights: any = [];

  vertical_dropdownSettings: any = {};
  dropdownSettings: any = {};
  dropdownSettingsEmployee: any = {};
  AgentdropdownSettings: any = {};
  LOB_dropdownSettings: any = {};
  SR_StatusDropdownSettings: any = {};

  ItemVerticalSelection: any = [];
  ItemEmployeeSelection: any = [];
  ItemLOBSelection: any = [];

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  maxDate = new Date();
  minDate = new Date();

  constructor(
    public api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Vertical_Id: ["", [Validators.required]],
      Region_Id: ["0"],
      Sub_Region_Id: ["0"],
      Emp_Id: [""],
      Agent_Id: [""],
      Product_Id: [""],
      Company_Id: [""],
      SRLOB: [""],
      SRStatus: ["", [Validators.required]],
      SR_Source_Type: [""],
      SR_Payout_Mode: [""],
      SR_Posting_Status: ["", [Validators.required]],
      Business_Month: ["", [Validators.required]],
      DateOrDateRange: ["", [Validators.required]],
    });

    this.vertical_dropdownSettings = {
      singleSelection: true,
      //enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsEmployee = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 2,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.AgentdropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 2,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.LOB_dropdownSettings = {
      singleSelection: false,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };
    this.SR_StatusDropdownSettings = {
      singleSelection: true,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };

    this.SRLOB_Ar = [
      { Id: "Motor", Name: "Motor" },
      { Id: "Non Motor", Name: "Non Motor" },
      { Id: "Health", Name: "Health" },
      { Id: "LI", Name: "LI" },
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
    this.SR_Payout_Mode_Ar = [
      { Id: "Advance", Name: "Advance" },
      { Id: "Weekly", Name: "Weekly" },
      { Id: "Monthly", Name: "Monthly" },
    ];

    this.SR_Posting_Status_Ar = [{ Id: "0", Name: "PendingForPosting" }];

    var selectedItemsSR_Status = [{ Id: "Logged", Name: "Logged" }];
    this.SearchForm.get("SRStatus").setValue(selectedItemsSR_Status);
  }

  ngOnInit(): void {
    this.Get();
    this.SearchComponentsData();
  }

  get FC() {
    return this.SearchForm.controls;
  }

  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .Call("sr/Agent/SearchComponentsData?User_Id=" + this.api.GetUserId())
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"]["Vertical"];
            //this.Emps_Ar = result['Data']['Hierarchy']['Employee'];
            this.Companies_Ar = result["Data"]["Ins_Compaines"];
            //this.Products_Ar = result['Data']['Products_Ar'];
            this.Region_Ar = result["Data"]["Region_Ar"];
            this.UserRights = result["Data"]["SR_User_Rights"];
            this.Bussiness_Months_Ar = result["Data"]["Bussiness_Months"];
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

  GetMonthWeeks(e) {
    var monthYear = e.target.value;
    this.api.IsLoading();
    this.api
      .Call(
        "brokerage/PostingData/GetMonthWeeks?User_Id=" +
          this.api.GetUserId() +
          "&monthYear=" +
          monthYear
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            const DateOrDateRange_Control =
              this.SearchForm.get("DateOrDateRange");

            DateOrDateRange_Control.setValue(null);

            DateOrDateRange_Control.updateValueAndValidity();

            this.minDate = new Date(result["first_day_this_month"]);
            this.maxDate = new Date(result["last_day_this_month"]);
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

  onItemSelect(item: any, Type: any) {
    // console.log('Type : '+ Type);
    // console.log('onItemSelect', item);

    if (Type == "Vertical") {
      this.Emps_Ar = [];
      this.Agents_Ar = [];
      this.Employee_Placeholder = "Select Employee";
      this.Agents_Placeholder = "Select Agent";

      this.ItemVerticalSelection.push(item.Id);
      // console.log(this.ItemVerticalSelection);
      this.GetEmployees();
      //this.GetEmployees('OneByOneSelect');
    }

    if (Type == "Employee") {
      this.Agents_Ar = [];

      this.ItemEmployeeSelection.push(item.Id);
      // console.log(this.ItemEmployeeSelection);
      this.GetAgents("OneByOneSelect");
    }
    if (Type == "LOB") {
      this.ItemLOBSelection.push(item.Id);
      // console.log(this.ItemLOBSelection);
      this.GetProducts("OneByOneSelect");
    }
  }

  //===== ON ITEM DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    // console.log('Type : '+ Type);
    // console.log('onDeSelect', item);

    if (Type == "Vertical") {
      this.Emps_Ar = [];
      this.Agents_Ar = [];
      this.Employee_Placeholder = "Select Employee";
      this.Agents_Placeholder = "Select Agent";

      var index = this.ItemVerticalSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemVerticalSelection.splice(index, 1);
      }
      this.GetEmployees();

      // console.log(this.ItemVerticalSelection);
      //this.GetEmployees('OneByOneDeSelect');
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
      // console.log(this.ItemLOBSelection);
      this.GetProducts("OneByOneDeSelect");
    }
  }

  //===== GET EMPLOYEES DATA =====//
  GetEmployees() {
    this.Emps_Ar = [];
    this.Agents_Ar = [];

    this.SearchForm.get("Emp_Id").setValue(null);
    this.SearchForm.get("Agent_Id").setValue(null);

    // console.log(this.ItemVerticalSelection);

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("Vertical_Id", this.ItemVerticalSelection.join());
    formData.append("Region_Id", this.SearchForm.value["Region_Id"]);
    formData.append("Sub_Region_Id", this.SearchForm.value["Sub_Region_Id"]);

    this.api.HttpPostType("sr/AgentTest/GetEmployees", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Emps_Ar = result["Data"];
          this.Employee_Placeholder =
            "Select Employee (" + this.Emps_Ar.length + ")";
          this.Agents_Placeholder = "Select Agent";
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  GetSubBranches(e) {
    this.GetEmployees();

    this.SearchForm.get("Sub_Region_Id").setValue("0");

    var Branch_Id = e.target.value;

    this.api.IsLoading();
    this.api
      .Call(
        "reports/AdminSrReport/GetSubBranches?Branch_Id=" +
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

  GetAgents(Type) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("RM_Ids", this.ItemEmployeeSelection.join());
    this.api.HttpPostType("sr/AgentTest/GetAgents", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Agents_Ar = result["Data"];
          this.Agents_Placeholder =
            "Select Agents (" + this.Agents_Ar.length + ")";
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  GetProducts(Type) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", this.ItemLOBSelection.join());
    this.api.HttpPostType("sr/AgentTest/GetProducts", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Products_Ar = result["Data"];
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
  }

  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      //// console.log(this.SearchForm.value);

      var fields = this.SearchForm.value;

      var DateOrDateRange = fields["DateOrDateRange"];
      var ToDate, FromDate;

      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      var query = {
        Role: this.api.GetUserData("UserType_Name"),

        Vertical_Id: fields["Vertical_Id"],
        Region_Id: fields["Region_Id"],
        Sub_Region_Id: fields["Sub_Region_Id"],

        Emp_Id: fields["Emp_Id"],
        Agent_Id: fields["Agent_Id"],

        LOB: fields["SRLOB"],
        Product_Id: fields["Product_Id"],
        Company_Id: fields["Company_Id"],

        Source: fields["SR_Source_Type"],
        SR_Status: fields["SRStatus"],

        SR_Payout_Mode: fields["SR_Payout_Mode"],
        SR_Posting_Status: fields["SR_Posting_Status"],

        To_Date: this.api.StandrdToDDMMYYY(ToDate),
        From_Date: this.api.StandrdToDDMMYYY(FromDate),
      };

      // console.log(query);

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

  ExportExcel(): void {
    //// console.log(this.SQL_Where_STR);

    const dialogConfig = new MatDialogConfig();
    // console.log(dialogConfig);

    //dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = false;
    dialogConfig.width = "25%";
    dialogConfig.height = "14%";
    //dialogConfig.position = 'absolute';
    dialogConfig.hasBackdrop = false;
    //dialogConfig.closeOnNavigation = false;

    dialogConfig.position = {
      top: "40%",
      left: "1%",
    };

    dialogConfig.data = {
      ReportType: "SuperAdmin",
      SQL_Where: this.SQL_Where_STR,
    };

    this.Is_Export = 0;

    const dialogRef = this.dialog.open(
      DownloadingViewBmsComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.SearchForm.get("Vertical_Id").setValue("");
    this.SearchForm.get("Region_Id").setValue("0");
    this.SearchForm.get("Sub_Region_Id").setValue("0");

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

    //this.TotalNetPremium = 0.00;
    //this.TotalSR = 0;
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

  Get() {
    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [10, 25, 50, 100, 500, 1000, 2000],
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/reports/AdminSrReport/GridData?User_Id=" +
                this.api.GetUserId() +
                "&PageName=BBR_Report&source=crm"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
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
      },
      columns: [
        { data: "Id" },
        { data: "SR_No" },
        { data: "LOB_Name" },
        { data: "File_Type" },
        { data: "Customer_Name" },
        { data: "Agent_Name" },
        { data: "RM_Name" },
        { data: "UW_Name" },
        { data: "Operation_Name" },
        { data: "Account_Name" },
        { data: "Estimated_Gross_Premium" },
        { data: "Add_Stamp" },
        { data: "SR_Current_Status" },
      ],
      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
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
      if (this.dataAr[i].isSelected)
        this.checkedList.push({
          Id: this.dataAr[i].Id,
          Agent_Id: this.dataAr[i].Agent_Id,
        });
    }
    //this.checkedList = JSON.stringify(this.checkedList);
    this.checkedList = this.checkedList;
    // console.log(this.checkedList);
  }

  Cancel() {
    this.Reload();
    this.masterSelected = false;
    this.checkedList = [];
  }

  SendBBR() {
    var Is_Confirm = "Are you sure that you want to change status this data?";

    if (confirm(Is_Confirm) == true) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());
      formData.append(
        "Business_Month",
        this.SearchForm.value["Business_Month"]
      );

      for (var i = 0; i < this.checkedList.length; i++) {
        formData.append("Agent_Ids[]", this.checkedList[i]["Agent_Id"]);
      }

      formData.append("checkedList", JSON.stringify(this.checkedList));

      this.api.IsLoading();
      this.api.HttpPostType("brokerage/BBR/Store_Request", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            const dialogRef = this.dialog.open(BrokrageRequestLoaderComponent, {
              width: "35%",
              height: "18%",
              disableClose: true,
              data: {
                Type: "BBR_Request",
                Payout_Mode: "",
                TotalRequest: result["TotalRequest"],
                Store_Id: result["Store_Id"],
              },
            });

            dialogRef.afterClosed().subscribe((result: any) => {
              // console.log(result);
              //alert('Modal closed');

              this.masterSelected = false;
              this.checkedList = [];
              this.Reload();
            });
          } else {
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.ErrorMsg(err.message);
        }
      );
    } else {
      this.Reload();
      this.masterSelected = false;
      this.checkedList = [];
    }
  }

  ExportExcelDemo() {
    var fields = this.SearchForm.value;

    var RM_Id_value;
    var Agent_Id_value;
    var Department_Id_value;
    var Product_Id_value;
    var Company_Id_value;
    var ToDate;
    var FromDate;

    var Emp_Id = fields["Emp_Id"];
    var Agent_Id = fields["Agent_Id"];
    var Department_Id = fields["Department_Id"];
    var Product_Id = fields["Product_Id"];
    var Company_Id = fields["Company_Id"];
    var DateOrDateRange = fields["DateOrDateRange"];
    var Source_value = fields["Source"];

    if (Emp_Id) {
      RM_Id_value = Emp_Id[0]["id"];
    }
    if (Agent_Id) {
      Agent_Id_value = Agent_Id[0]["id"];
    }
    if (Department_Id) {
      Department_Id_value = Department_Id[0]["id"];
    }
    if (Product_Id) {
      Product_Id_value = Product_Id[0]["id"];
    }

    if (Company_Id) {
      Company_Id_value = Company_Id[0]["id"];
    }
    if (DateOrDateRange) {
      ToDate = DateOrDateRange[0];
      FromDate = DateOrDateRange[1];
    }

    var query = {
      RMId: RM_Id_value,
      AgentId: Agent_Id_value,

      DepartmentId: Department_Id_value,

      Region_Id: fields["Region_Id"],
      Sub_Region_Id: fields["Sub_Region_Id"],

      ProductId: Product_Id_value,

      CompanyId: Company_Id_value,
      Source: Source_value,
      LOB_Type: fields["LOB_Type"],

      To_Date: this.api.StandrdToDDMMYYY(ToDate),
      From_Date: this.api.StandrdToDDMMYYY(FromDate),
    };

    // console.log(query);

    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());

    formData.append("query", JSON.stringify(query));
    formData.append("Type", "1");

    this.api.IsLoading();
    this.api
      .HttpPostType("reports/AdminSrReport/ExportExcelDemo", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Limits = result["Limits"];
            this.Export_Id = result["Export_Id"];
            // console.log(this.Limits);

            this.Test();
          } else {
            //alert(result['Message']);
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          // console.log(err.message);
          this.api.ErrorMsg(err.message);
        }
      );
  }

  async Test() {
    this.Percentage_Slot = 1;

    for (let i = 0; i < this.Limits.length; i++) {
      var limitArea = this.Limits[i];

      var url =
        environment.apiUrl +
        "/reports/AdminSrReport/ExportExcelDemoLimit?Export_Id=" +
        this.Export_Id +
        "&limit=" +
        limitArea;

      await this.http
        .get<any>(
          this.api.additionParmsEnc(url),
          this.api.getHeader(environment.apiUrl)
        )
        .toPromise()
        .then((res: any) => {
          //this.obsevableResponseArray.push(data);
          var data = JSON.parse(this.api.decryptText(res.response));

          //this.Percentage_Slot = (this.Percentage_Slot+data.Percentage_Slot);
          this.Percentage_Slot = (
            parseFloat(this.Percentage_Slot) + parseFloat(data.Percentage_Slot)
          ).toFixed(2);

          if (data.Is_Prepre_Excel == 1) {
            //alert(data.Is_Prepre_Excel);
            this.Is_Prepre_Excel = 1;
            this.Percentage_Slot = 0;

            this.api
              .Call(
                "reports/AdminSrReport/Prepre_Excel?Export_Id=" + this.Export_Id
              )
              .then(
                (result) => {
                  if (result["Status"] == true) {
                    this.api.ToastMessage(result["Message"]);
                    this.Is_Prepre_Excel = 0;
                    window.open(result["DownloadUrl"]);
                  } else {
                    this.api.ErrorMsg(result["Message"]);
                  }
                },
                (err) => {
                  // console.log(err.message);
                  this.api.ErrorMsg(err.message);
                }
              );
          }
        });
    }
  }

  Actions(row_Id): void {}
  ViewDocuments(row_Id): void {}

  EditSR(row_Id): void {
    const dialogRef = this.dialog.open(SrEditByRightComponent, {
      width: "95%",
      height: "90%",
      data: { Id: row_Id },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }

  CancelSR(row_Id, SRNo): void {
    const dialogRef = this.dialog.open(AdminSRCancelComponent, {
      width: "35%",
      height: "45%",
      data: { Id: row_Id, SR_No: SRNo },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }

  EditPayout(row_Id, Index): void {
    const dialogRef = this.dialog.open(EditsrpayoutComponent, {
      width: "65%",
      height: "52%",
      data: { Id: row_Id, Edit_Index: Index },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.Reload();
    });
  }
}
