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

import { DownloadingViewBmsComponent } from "../../modals/brokerage/downloading-view-bms/downloading-view-bms.component";
import { BrokrageRequestLoaderComponent } from "../../modals/brokerage/brokrage-request-loader/brokrage-request-loader.component";
import { EditsrpayoutComponent } from "../../modals/brokerage/editsrpayout/editsrpayout.component";

class ColumnsObj {
  Id: string;
  isSelected: any;
  Agent_Id: any;
  SR_No: string;
  Posting_Status: any;
  Add_Stamp: string;
  SR_Source: string;
  SR_Status: string;
  LOB_Name: string;
  File_Type: string;
  Segment_Id: string;
  Product_Id: string;
  SubProduct_Id: string;
  Class_Id: string;
  Sub_Class_Id: string;
  Net_Premium: string;
  Estimated_Gross_Premium: string;
  PayoutDetails: string;
  Customer_Name: string;
  Agent_Name: string;
  RM_Name: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  PostingCountAr: any;
  SQL_Where: any;
}

@Component({
  selector: "app-payout-posting",
  templateUrl: "./payout-posting.component.html",
  styleUrls: ["./payout-posting.component.css"],
})
export class PayoutPostingComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  TotalNetPremium: number = 0.0;
  TotalSR: number = 0;
  SQL_Where_STR: any;

  SearchForm: FormGroup;
  isSubmitted = false;

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  Companies_Ar: Array<any>;
  Products_Ar: Array<any>;
  AccountsUser_Ar: Array<any>;
  Bussiness_Months_Ar: Array<any>;
  Weeks_Ar: Array<any>;
  Is_Export: any = 0;

  SRLOB_Ar: any = [];
  SRStatus_Ar: any = [];
  SRSource_Ar: any = [];
  SR_Payout_Status_Ar: any = [];

  vertical_dropdownSettings: any = {};
  dropdownSettings: any = {};
  AgentdropdownSettings: any = {};
  LOB_dropdownSettings: any = {};

  ItemVerticalSelection: any = [];
  ItemEmployeeSelection: any = [];
  ItemLOBSelection: any = [];

  User_Rights: any = [];

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";

  Payout_Mode: any = "";

  Assign_User: any = "";
  Remark: any = "";

  TotalPendingForPosting: number = 0;
  TotalPendingForAccounts: number = 0;
  TotalRejectByAccounts: number = 0;
  TotalPendingForBanking: number = 0;
  TotalRejectByBanking: number = 0;
  TotalApproved: number = 0;
  TotalPaid: number = 0;

  TotalPendingForPosting_Amt: number = 0;
  TotalPendingForAccounts_Amt: number = 0;
  TotalRejectByAccounts_Amt: number = 0;
  TotalPendingForBanking_Amt: number = 0;
  TotalRejectByBanking_Amt: number = 0;
  TotalApproved_Amt: number = 0;
  TotalPaid_Amt: number = 0;

  maxDate = new Date();
  minDate = new Date();

  constructor(
    public api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    //alert(this.router.url);
    if (this.router.url == "/brokerage/posting/advance") {
      this.Payout_Mode = "Daily";
    } else if (this.router.url == "/brokerage/posting/weekly") {
      this.Payout_Mode = "Weekly";
    } else if (this.router.url == "/brokerage/posting/monthly") {
      this.Payout_Mode = "Monthly";
    } else if (this.router.url == "/brokerage/posting/fortnight") {
      this.Payout_Mode = "Fortnight";
    } else if (this.router.url == "/brokerage/posting/early") {
      this.Payout_Mode = "Early";
    } else if (this.router.url == "/brokerage/posting/blocked-cases") {
      this.Payout_Mode = "Blocked Cases";
    } else {
      alert("Unkown URI Segment");
    }

    if (this.Payout_Mode == "Daily") {
      this.SearchForm = this.fb.group({
        PO_Group: ["", [Validators.required]],
        Vertical_Id: ["0"],
        Region_Id: ["0"],
        Sub_Region_Id: ["0"],
        Emp_Id: [""],
        Agent_Id: [""],
        Product_Id: [""],
        Company_Id: [""],
        SRLOB: [""],
        SRStatus: [""],
        SR_Source_Type: [""],
        SR_Payout_Status: ["", [Validators.required]],
        Business_Month: [""],
        Week: [""],
        DateOrDateRange: [""],
      });
    } else if (this.Payout_Mode == "Weekly") {
      this.SearchForm = this.fb.group({
        PO_Group: ["", [Validators.required]],
        Vertical_Id: ["0"],
        Region_Id: ["0"],
        Sub_Region_Id: ["0"],
        Emp_Id: [""],
        Agent_Id: [""],
        Product_Id: [""],
        Company_Id: [""],
        SRLOB: [""],
        SRStatus: [""],
        SR_Source_Type: [""],
        SR_Payout_Status: ["", [Validators.required]],
        Business_Month: ["", [Validators.required]],
        Week: [""],
        DateOrDateRange: [""],
      });
    } else if (this.Payout_Mode == "Blocked Cases") {
      this.SearchForm = this.fb.group({
        PO_Group: [""],
        Vertical_Id: ["0"],
        Region_Id: ["0"],
        Sub_Region_Id: ["0"],
        Emp_Id: [""],
        Agent_Id: [""],
        Product_Id: [""],
        Company_Id: [""],
        SRLOB: [""],
        SRStatus: [""],
        SR_Source_Type: [""],
        SR_Payout_Status: [""],
        Business_Month: [""],
        Week: [""],
        DateOrDateRange: ["", [Validators.required]],
      });
    } else {
      this.SearchForm = this.fb.group({
        PO_Group: ["", [Validators.required]],
        Vertical_Id: ["0", [Validators.required]],
        Region_Id: ["0"],
        Sub_Region_Id: ["0"],
        Emp_Id: ["", [Validators.required]],
        Agent_Id: ["", [Validators.required]],
        Product_Id: [""],
        Company_Id: [""],
        SRLOB: [""],
        SRStatus: [""],
        SR_Source_Type: [""],
        SR_Payout_Status: ["", [Validators.required]],
        Business_Month: [""],
        Week: [""],
        DateOrDateRange: [""],
        PORangeFrom: [0],
        PORangeTo: [0],
      });
    }

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

    /*	
	this.SRLOB_Ar = [{Id:'Motor',Name:'Motor'},{Id:'Non Motor',Name:'Non Motor'},{Id:'Health',Name:'Health'},{Id:'LI',Name:'Life'},{Id:'Travel',Name:'Travel'},{Id:'Personal Accident',Name:'Personal Accident'}];
	this.SRStatus_Ar = [{Id:'Complete',Name:'Booked'},{Id:'Pending',Name:'UnBooked'},{Id:'Cancelled',Name:'Cancelled'}];
	this.SRSource_Ar = [{Id:'BMS',Name:'Offline'},{Id:'Web',Name:'Online'},{Id:'Excel',Name:'Excel'}];
	 
	
	this.SR_Payout_Status_Ar = [
			{Id:'0',Name:'PendingForPosting'},
			{Id:'1',Name:'PendingForAccounts'},
			{Id:'2',Name:'RejectByAccounts'},
			{Id:'3',Name:'PendingForBanking'},
			{Id:'4',Name:'RejectByBanking'},
			{Id:'5',Name:'Approved'},
			{Id:'6',Name:'Paid/PayoutTransferred'}
		];
	*/

    //this.minDate.setDate(this.minDate.setFullYear(2001));
    //this.maxDate.setDate(this.maxDate.getDate()-this.maxDate.getDate());
  }

  ngOnInit(): void {
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
        this.checkedList.push({
          Id: this.dataAr[i].Id,
          Posting_Status: this.dataAr[i].Posting_Status,
          Agent_Id: this.dataAr[i].Agent_Id,
        });
      }
    }
    //this.checkedList = JSON.stringify(this.checkedList);
    this.checkedList = this.checkedList;
    // console.log(this.checkedList);
  }

  CancelTransfer() {
    this.Reload();
    this.masterSelected = false;
    this.checkedList = [];
  }

  async Transfer() {
    const Is_Confirm = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to change status this data?",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
    });

    if (Is_Confirm) {
      var fields = this.SearchForm.value;

      var DateOrDateRange = fields["DateOrDateRange"];
      var ToDate, FromDate;

      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      var Date_Range = JSON.stringify({
        To: this.api.StandrdToDDMMYYY(ToDate),
        From: this.api.StandrdToDDMMYYY(FromDate),
      });

      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());

      formData.append("Assign_User", this.Assign_User);
      formData.append("Remark", this.Remark);
      formData.append("Payout_Mode", this.Payout_Mode);

      //formData.append('Date_Range',Date_Range);

      formData.append("To_Date", ToDate);
      formData.append("From_Date", FromDate);

      formData.append("PO_Group", fields["PO_Group"]);
      formData.append("Business_Month", fields["Business_Month"]);
      formData.append("Week", fields["Week"]);

      formData.append("checkedList", JSON.stringify(this.checkedList));

      for (var i = 0; i < this.checkedList.length; i++) {
        formData.append("Agent_Ids[]", this.checkedList[i]["Agent_Id"]);
      }

      this.api.IsLoading();
      this.api
        .HttpPostType("brokerage/LPA_PayoutPosting/PrepareRequest", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              //this.Reload();
              this.masterSelected = false;
              this.checkedList = [];
              //this.api.ToastMessage(result['Message']);
              //this.PrepareRequestChunks(result);

              const dialogRef = this.dialog.open(
                BrokrageRequestLoaderComponent,
                {
                  width: "35%",
                  height: "18%",
                  disableClose: true,
                  data: {
                    Type: "Posting",
                    Payout_Mode: this.Payout_Mode,
                    TotalRequest: result["TotalRequest"],
                    Store_Id: result["Store_Id"],
                  },
                }
              );

              dialogRef.afterClosed().subscribe((result: any) => {
                // console.log(result);
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

  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .Call(
        "sr/Agent/SearchComponentsData?request_page=posting&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.SRLOB_Ar = result["Data"]["SRLOB_Ar"];
            this.SRStatus_Ar = result["Data"]["SRStatus_Ar"];
            //this.SRType_Ar = result['Data']['SRType_Ar'];
            this.SRSource_Ar = result["Data"]["SRSource_Ar"];
            //this.SR_Payout_Mode_Ar = result['Data']['SRPayout_Mode_Ar'];
            this.SR_Payout_Status_Ar = result["Data"]["SRPosting_Status_Ar"];

            this.Vertical_Ar = result["Data"]["Vertical"];
            //this.Emps_Ar = result['Data']['Hierarchy']['Employee'];
            this.Companies_Ar = result["Data"]["Ins_Compaines"];
            //this.Products_Ar = result['Data']['Products_Ar'];
            this.Region_Ar = result["Data"]["Region_Ar"];
            this.AccountsUser_Ar = result["Data"]["AccountsUser"];
            this.Bussiness_Months_Ar = result["Data"]["Bussiness_Months"];
            this.User_Rights = result["Data"]["SR_User_Rights"];
            //// console.log(this.User_Rights);

            //alert(this.Payout_Mode);
            //this.SearchForm.get('Business_Month').setValue(result['Data']['CurrentMonth']);

            const Week_Control = this.SearchForm.get("Week");
            const DateOrDateRange_Control =
              this.SearchForm.get("DateOrDateRange");

            if (this.Payout_Mode == "Weekly") {
              Week_Control.setValidators([Validators.required]);
              DateOrDateRange_Control.setValidators(null);
            } else {
              Week_Control.setValidators(null);
              DateOrDateRange_Control.setValidators([Validators.required]);
            }

            Week_Control.updateValueAndValidity();
            DateOrDateRange_Control.updateValueAndValidity();
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
        "brokerage/LPA_PostingData/GetMonthWeeks?User_Id=" +
          this.api.GetUserId() +
          "&monthYear=" +
          monthYear
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Weeks_Ar = result["Data"];

            const Week_Control = this.SearchForm.get("Week");
            const DateOrDateRange_Control =
              this.SearchForm.get("DateOrDateRange");
            Week_Control.setValue("");
            DateOrDateRange_Control.setValue(null);
            Week_Control.updateValueAndValidity();
            DateOrDateRange_Control.updateValueAndValidity();

            //// console.log(new Date(result['first_day_this_month']));
            //// console.log(new Date(result['last_day_this_month']));

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

      this.ItemVerticalSelection.push(item.Id);
      // console.log(this.ItemVerticalSelection);
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

  onSelectAll(items: any, Type: any) {
    // console.log('Type : '+ Type);
    // console.log('onSelectAll', items);

    var Ar = [];
    for (var i = 0; i < items.length; i++) {
      Ar.push(items[i]["Id"]);
    }
    var AllItems = Ar; //Ar.join();
    // console.log(AllItems);

    this.ItemEmployeeSelection = AllItems;
    this.GetAgents("SelectAll");
  }

  onItemDeSelect(item: any, Type: any) {
    // console.log('Type : '+ Type);
    // console.log('onDeSelect', item);

    if (Type == "Vertical") {
      this.Emps_Ar = [];
      this.Agents_Ar = [];

      var index = this.ItemVerticalSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemVerticalSelection.splice(index, 1);
      }
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

  GetEmployees() {
    this.Emps_Ar = [];
    this.Agents_Ar = [];

    this.SearchForm.get("Emp_Id").setValue(null);
    this.SearchForm.get("Agent_Id").setValue(null);

    if (this.Payout_Mode == "Daily" || this.Payout_Mode == "Blocked Cases") {
      this.SearchForm.get("Emp_Id").setValidators(null);
      this.SearchForm.get("Agent_Id").setValidators(null);
    } else {
      this.SearchForm.get("Emp_Id").setValidators([Validators.required]);
      this.SearchForm.get("Agent_Id").setValidators([Validators.required]);
    }

    this.SearchForm.get("Emp_Id").updateValueAndValidity();
    this.SearchForm.get("Agent_Id").updateValueAndValidity();

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    //formData.append('Type',Type);
    formData.append("Vertical_Id", this.SearchForm.value["Vertical_Id"]);
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
    formData.append("Payout_Mode", this.Payout_Mode);
    formData.append("RM_Ids", this.ItemEmployeeSelection.join());
    this.api.HttpPostType("sr/AgentTest/GetAgentsInPosting", formData).then(
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
      // console.log(this.SearchForm.value);

      var fields = this.SearchForm.value;

      var DateOrDateRange = fields["DateOrDateRange"];
      var ToDate, FromDate;

      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      // console.log(typeof fields['PORangeFrom']);
      // console.log(fields['PORangeFrom']);

      if (this.Payout_Mode == "Monthly") {
        //if(fields['PORangeFrom'] > 1){
        //alert('Please enter PO range To');
        //return;
        //}

        if (fields["PORangeFrom"] > fields["PORangeTo"]) {
          alert("Please enter vaild PO range To");
          return;
        }
      }

      var query = {
        Role: this.api.GetUserData("UserType_Name"),

        PO_Group: fields["PO_Group"],
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
        SR_Payout_Status: fields["SR_Payout_Status"],

        Business_Month: fields["Business_Month"],
        Week: fields["Week"],

        To_Date: this.api.StandrdToDDMMYYY(ToDate),
        From_Date: this.api.StandrdToDDMMYYY(FromDate),

        PORangeFrom: fields["PORangeFrom"],
        PORangeTo: fields["PORangeTo"],
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
      ReportType: "PostingReport",
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

    this.SearchForm.get("Vertical_Id").setValue("0");
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

    this.TotalNetPremium = 0.0;
    this.TotalSR = 0;
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
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
                "/brokerage/LPA_PostingData/GridData?Payout_Mode=" +
                this.Payout_Mode +
                "&User_Id=" +
                this.api.GetUserId() +
                "&source=crm"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            that.TotalPendingForPosting =
              resp.PostingCountAr["PendingForPosting"];
            that.TotalPendingForAccounts =
              resp.PostingCountAr["PendingForAccounts"];
            that.TotalRejectByAccounts =
              resp.PostingCountAr["RejectByAccounts"];
            that.TotalPendingForBanking =
              resp.PostingCountAr["PendingForBanking"];
            that.TotalRejectByBanking = resp.PostingCountAr["RejectByBanking"];
            that.TotalApproved = resp.PostingCountAr["Approved"];
            that.TotalPaid = resp.PostingCountAr["Paid"];

            that.TotalPendingForPosting_Amt =
              resp.PostingCountAr["PendingForPosting_Amt"];
            that.TotalPendingForAccounts_Amt =
              resp.PostingCountAr["PendingForAccounts_Amt"];
            that.TotalRejectByAccounts_Amt =
              resp.PostingCountAr["RejectByAccounts_Amt"];
            that.TotalPendingForBanking_Amt =
              resp.PostingCountAr["PendingForBanking_Amt"];
            that.TotalRejectByBanking_Amt =
              resp.PostingCountAr["RejectByBanking_Amt"];
            that.TotalApproved_Amt = resp.PostingCountAr["Approved_Amt"];
            that.TotalPaid_Amt = resp.PostingCountAr["Paid_Amt"];

            that.SQL_Where_STR = resp.SQL_Where;
            //alert(resp.SQL_Where);
            if (that.dataAr.length > 0) {
              that.Is_Export = 1;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              //TotalNetPremiumAr: resp.totalPremium,
              data: [],
            });
          });
      },
      /*	
	 columns: [{ data: 'Id' }, //orderable : false
				{ data: 'SR_No' },
				{ data: 'Add_Stamp' },
				{ data: 'SR_Source' }, 
				{ data: 'SR_Status' }, 
				{ data: 'LOB_Name' },
				{ data: 'File_Type' },
				 
				{ data: 'Net_Premium' },
				{ data: 'Estimated_Gross_Premium' },
				{ data: 'PayoutDetails' },
				{ data: 'Customer_Name' },
				{ data: 'Agent_Name' },
				{ data: 'RM_Name' },
			],
	*/
      columnDefs: [
        {
          targets: [0], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }

  Actions(row_Id): void {
    //var baseurl = 'http://localhost:4300/';
    var baseurl = "https://crm.squareinsurance.in/";
    var url =
      baseurl +
      "business-login/form/general-insurance/1/bms/" +
      this.api.GetUserId() +
      "/" +
      row_Id +
      "/web";
    window.open(url, "", "fullscreen=yes");
  }
  ViewDocuments(row_Id): void {}

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
