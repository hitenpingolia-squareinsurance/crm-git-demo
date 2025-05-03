import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { BmsapiService } from "src/app/providers/bmsapi.service";
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

import { DownloadingViewBmsComponent } from "src/app/modals/brokerage/downloading-view-bms/downloading-view-bms.component";
//import { CreateMisReportNameComponent } from '../../..//modals/create-mis-report-name/create-mis-report-name.component';

class ColumnsObj {
  Id: string;
  isSelected: any;
  Status: any;
  HodToAdmin: any;
  SR_No: string;
  LOB_Name: string;
  File_Type: string;
  Customer_Name: string;
  RM_Name: string;
  Estimated_Gross_Premium: string;
  Add_Stamp: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  totalPremium: any[];
  SR_Current_UsersList: any;
  SQL_Where: any;
}

@Component({
  selector: "app-files-payout-request",
  templateUrl: "./files-payout-request.component.html",
  styleUrls: ["./files-payout-request.component.css"],
})
export class FilesPayoutRequestsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  TotalNetPremium: number = 0.0;
  TotalSR: number = 0;
  SQL_Where_STR: any;
  SR_Current_UsersList_Ar: any = [];
  SR_Current_UsersList_Flag: any = 1;

  SearchForm: FormGroup;
  SearchForm1: FormGroup;
  isSubmitted = false;
  isSubmitted1 = false;

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  Companies_Ar: Array<any>;
  Products_Ar: Array<any>;
  Is_Export: any = 0;

  SRAgentType_Ar: any = [];
  SRLOB_Ar: any = [];
  SRStatus_Ar: any = [];
  SRType_Ar: any = [];
  SRSource_Ar: any = [];
  selectedItemsSR_Status: any = [];

  vertical_dropdownSettings: any = {};
  dropdownSettings: any = {};
  AgentdropdownSettings: any = {};
  LOB_dropdownSettings: any = {};
  SR_StatusDropdownSettings: any = {};

  ItemVerticalSelection: any = [];
  ItemEmployeeSelection: any = [];
  ItemLOBSelection: any = [];

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";

  CountHierarchy_Emp: any = 0;

  User_Rights: any = [];
  Filter1Submitted = 0;

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];
  Assign_Status: any = "";
  Assign_Remark: any = "";

  Payout_Mode: any = "";

  constructor(
    public api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    if (this.router.url == "/sales-brokerage/files-payout-request/daily") {
      this.Payout_Mode = "Daily";
    } else if (
      this.router.url == "/sales-brokerage/files-payout-request/weekly"
    ) {
      this.Payout_Mode = "Weekly";
    } else if (
      this.router.url == "/sales-brokerage/files-payout-request/monthly"
    ) {
      this.Payout_Mode = "Monthly";
    }else if(this.router.url == '/sales-brokerage/files-payout-request/fortnight'){
			this.Payout_Mode = 'Fortnight';
		} else {
      alert("Unkown URI Segment");
    }

    this.SearchForm = this.fb.group({
      Vertical_Id: ["0"],
      Region_Id: ["0"],
      Sub_Region_Id: ["0"],
      Emp_Id: [""],
      Report_Type: [{ value: "0", disabled: true }],
      SRAgent_Type: [""],
      Agent_Id: [""],
      Product_Id: [""],
      Company_Id: [""],
      SRLOB: [""],
      Payout_Mode: [this.Payout_Mode],
      Request_Type: [""],
      Request_Status: ["", [Validators.required]],
      DateOrDateRange: ["", [Validators.required]],
    });

    this.SearchForm1 = this.fb.group({
      GlobalSearch: ["", [Validators.required]],
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

    this.SRAgentType_Ar = [
      { Id: "POS", Name: "POS" },
      { Id: "SP", Name: "SP" },
      { Id: "SPC", Name: "SPC" },
      { Id: "Dealer", Name: "Dealer" },
      { Id: "Direct", Name: "Direct" },
    ];
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
    this.SRType_Ar = [
      { Id: "Normal", Name: "Normal" },
      { Id: "Endorsement", Name: "Endorsement" },
      { Id: "Short", Name: "Short" },
      { Id: "Recovery", Name: "Recovery" },
      { Id: "Extra-Payout", Name: "Extra Reward" },
    ];
    this.SRSource_Ar = [
      { Id: "BMS", Name: "Offline" },
      { Id: "Web", Name: "Online" },
      { Id: "Excel", Name: "Excel" },
    ];

    this.selectedItemsSR_Status = [{ Id: "Logged", Name: "Logged" }];

    //this.SearchForm.get('SRStatus').setValue(this.selectedItemsSR_Status);
    //this.SearchForm.get('Vertical_Id').setValue(this.api.GetUserData('Department_Id'));
  }

  ngOnInit(): void {
    this.Get();
    this.SearchComponentsData();
    this.GetEmployees();
  }

  get FC() {
    return this.SearchForm.controls;
  }
  get FC1() {
    return this.SearchForm1.controls;
  }

  checkUncheckAll() {
    //   //   console.log(this.masterSelected);

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
      if (
        this.dataAr[i].isSelected == true &&
        this.dataAr[i].HodToAdmin == 1 &&
        this.dataAr[i].Status == 2 &&
        this.api.GetUserData("User_Role") == "Hod"
      ) {
        this.checkedList.push({
          Id: this.dataAr[i].Id,
        });
      }

      if (
        this.dataAr[i].isSelected == true &&
        this.dataAr[i].HodToAdmin == 2 &&
        this.dataAr[i].Status == 2 &&
        this.User_Rights.Is_PO_Request_Approval == 1
      ) {
        this.checkedList.push({
          Id: this.dataAr[i].Id,
        });
      }

      if (
        this.dataAr[i].isSelected == true &&
        this.dataAr[i].HodToAdmin == 3 &&
        this.dataAr[i].Status == 2 &&
        this.User_Rights.Is_PO_Request_Approval == 2
      ) {
        this.checkedList.push({
          Id: this.dataAr[i].Id,
        });
      }
    }
    //this.checkedList = JSON.stringify(this.checkedList);
    this.checkedList = this.checkedList;
    //   //   console.log(this.checkedList);
  }

  Cancel() {
    this.Reload();
    this.masterSelected = false;
    this.checkedList = [];
  }

  UpdateRequest() {
    var Is_Confirm = "Are you sure that you want to change status this data?";

    if (confirm(Is_Confirm) == true) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());

      formData.append("Assign_Status", this.Assign_Status);
      formData.append("Assign_Remark", this.Assign_Remark);
      formData.append("checkedList", JSON.stringify(this.checkedList));
      
      for (var i = 0; i < this.checkedList.length; i++) {
        formData.append("Ids[]", this.checkedList[i]["Id"]);
      }

      this.api.IsLoading();
      this.api
        .HttpPostType("brokerage/SalesPayoutEdit/UpdateRequests", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.Reload();
              this.masterSelected = false;
              this.checkedList = [];
              //this.api.Toast('Success',result['Message']);
              this.api.ToastMessage(result["Message"]);
            } else {
              this.api.ErrorMsg(result["Message"]);
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            ////   //   console.log(err.message);
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
      .Call("sr/Agent/SearchComponentsData?User_Id=" + this.api.GetUserId())
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.User_Rights = result["Data"]["SR_User_Rights"];
            //this.Emps_Ar = result['Data']['Hierarchy']['Employee'];
            this.Companies_Ar = result["Data"]["Ins_Compaines"];
            //this.Products_Ar = result['Data']['Products_Ar'];
            this.Region_Ar = result["Data"]["Region_Ar"];

            if (
              this.api.GetUserData("User_Role") == "Hod" &&
              this.User_Rights.Is_Accounts == 0
            ) {
              this.SearchForm.get("Request_Type").setValidators([
                Validators.required,
              ]);
              this.SearchForm.get("Request_Type").updateValueAndValidity();
            }
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

  ReportTypeFilter(selectionAr) {
    //   //   console.log(selectionAr.length);

    if (selectionAr.length == 1) {
      this.SearchForm.get("Report_Type").enable();
      this.SearchForm.get("Report_Type").updateValueAndValidity();

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Vertical_Id", this.SearchForm.value["Vertical_Id"]);
      formData.append("Hierarchy_Emp_Id", selectionAr[0]);
      this.api
        .HttpPostType("sr/AgentTest/CountHierarchy_Employees", formData)
        .then(
          (result) => {
            if (result["Status"] == true) {
              this.CountHierarchy_Emp = result["Total"];
            } else {
              this.api.ErrorMsg(result["Message"]);
            }
          },
          (err) => {
            this.api.ErrorMsg(
              "Network Error, Please try again ! " + err.message
            );
          }
        );
    } else {
      this.SearchForm.get("Report_Type").setValue("0");
      this.SearchForm.get("Report_Type").disable();
      this.SearchForm.get("Report_Type").updateValueAndValidity();
    }
  }

  onItemSelect(item: any, Type: any) {
    //   //   console.log('Type : ' + Type);
    //   //   console.log('onItemSelect', item);

    if (Type == "Vertical") {
      this.Emps_Ar = [];
      this.Agents_Ar = [];

      this.ItemVerticalSelection.push(item.Id);
      //   //   console.log(this.ItemVerticalSelection);
      //this.GetEmployees('OneByOneSelect');
    }

    if (Type == "Employee") {
      this.Agents_Ar = [];
      this.ItemEmployeeSelection.push(item.Id);
      ////   //   console.log(this.ItemEmployeeSelection.length);

      this.ReportTypeFilter(this.ItemEmployeeSelection);

      this.GetAgents("OneByOneSelect");
    }
    if (Type == "LOB") {
      this.ItemLOBSelection.push(item.Id);
      //   //   console.log(this.ItemLOBSelection);
      this.GetProducts("OneByOneSelect");
    }
  }

  onItemDeSelect(item: any, Type: any) {
    //   //   console.log('Type : ' + Type);
    //   //   console.log('onDeSelect', item);

    if (Type == "Vertical") {
      this.Emps_Ar = [];
      this.Agents_Ar = [];

      var index = this.ItemVerticalSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemVerticalSelection.splice(index, 1);
      }
      ////   //   console.log(this.ItemVerticalSelection);
      //this.GetEmployees('OneByOneDeSelect');
    }

    if (Type == "Employee") {
      this.Agents_Ar = [];

      var index = this.ItemEmployeeSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemEmployeeSelection.splice(index, 1);
      }
      ////   //   console.log(this.ItemEmployeeSelection);

      this.ReportTypeFilter(this.ItemEmployeeSelection);

      this.GetAgents("OneByOneDeSelect");
    }
    if (Type == "LOB") {
      var index = this.ItemLOBSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemLOBSelection.splice(index, 1);
      }
      //   //   console.log(this.ItemLOBSelection);
      this.GetProducts("OneByOneDeSelect");
    }
  }

  GetEmployees() {
    this.Emps_Ar = [];
    this.Agents_Ar = [];
    this.ItemEmployeeSelection = [];

    this.SearchForm.get("Emp_Id").setValue(null);
    this.SearchForm.get("Agent_Id").setValue(null);

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

  SearchBtn(FilterType: any) {
    var GlobalSearch = "";
    var ToDate, FromDate, DateOrDateRange;

    var fields = this.SearchForm.value;
    var fields1 = this.SearchForm1.value;

    if (FilterType == "1") {
      this.isSubmitted1 = true;
      if (this.SearchForm1.invalid) {
        return;
      }
    } else {
      this.isSubmitted = true;
      if (this.SearchForm.invalid) {
        return;
      }
    }

    GlobalSearch = fields1["GlobalSearch"];
    DateOrDateRange = fields["DateOrDateRange"];

    if (DateOrDateRange) {
      ToDate = DateOrDateRange[0];
      FromDate = DateOrDateRange[1];
    }

    var query = {
      Role: this.api.GetUserData("UserType_Name"),

      Vertical_Id: fields["Vertical_Id"],
      Region_Id: fields["Region_Id"],
      Sub_Region_Id: fields["Sub_Region_Id"],

      Report_Type: fields["Report_Type"],
      Emp_Id: fields["Emp_Id"],
      SRAgent_Type: fields["SRAgent_Type"],
      Agent_Id: fields["Agent_Id"],

      LOB: fields["SRLOB"],
      Product_Id: fields["Product_Id"],
      Company_Id: fields["Company_Id"],

      Source: fields["SR_Source_Type"],
      Payout_Mode: fields["Payout_Mode"],
      Request_Type: fields["Request_Type"],
      Request_Status: fields["Request_Status"],
      GlobalSearch: GlobalSearch,

      To_Date: this.api.StandrdToDDMMYYY(ToDate),
      From_Date: this.api.StandrdToDDMMYYY(FromDate),
    };

    this.Is_Export = 0;
    this.SR_Current_UsersList_Flag = 1;
    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
      this.Is_Export = 1;
    });
  }

  ExportExcel(): void {
    ////   //   console.log(this.SQL_Where_STR);
    // const dialogRef = this.dialog.open(CreateMisReportNameComponent, {
    // 	width: '70%',
    // 	height:'70%',
    // 	//disableClose : true,
    // 	data: {SQL_Where: this.SQL_Where_STR,componentName:'Files-Payout'}
    //   });
    //   this.Is_Export = 0;
    //   dialogRef.afterClosed().subscribe(result => {
    // 	//   //   console.log(result);
    //   });
    /*
		const dialogConfig = new MatDialogConfig();
		  //   //   console.log(dialogConfig);
		   
		  //dialogConfig.disableClose = true;
		  //dialogConfig.autoFocus = false;
		  dialogConfig.width = '25%';
		  dialogConfig.height = '14%';
		  //dialogConfig.position = 'absolute';
		  dialogConfig.hasBackdrop = false;
		  //dialogConfig.closeOnNavigation = false;
		   
		  dialogConfig.position = { 
			  'top': '40%',
			  left: '1%'
		  };
		  
		  dialogConfig.data = {
			  ReportType : 'SuperAdmin',
			  SQL_Where: this.SQL_Where_STR,
		  };
		  
		  this.Is_Export = 0;
		  
		  const dialogRef = this.dialog.open(DownloadingViewBmsComponent,dialogConfig);
  
		  dialogRef.afterClosed().subscribe(result => {
			//   //   console.log(result);
		  });
		  */
  }

  ClearSearch() {
    this.Filter1Submitted = 0;
    this.isSubmitted = false;
    this.isSubmitted1 = false;
    this.SearchForm.reset();
    this.SearchForm1.reset();

    this.SearchForm.get("Vertical_Id").setValue("0");
    this.SearchForm.get("Region_Id").setValue("0");
    this.SearchForm.get("Sub_Region_Id").setValue("0");
    this.SearchForm.get("Report_Type").setValue("0");

    this.Emps_Ar = [];
    this.Agents_Ar = [];

    this.Employee_Placeholder = "Select Employee";
    this.Agents_Placeholder = "Select Agent";

    this.ItemVerticalSelection = [];
    this.ItemEmployeeSelection = [];
    this.ItemLOBSelection = [];
    //this.SR_Current_UsersList_Ar=[];

    this.dataAr = [];
    this.ResetDT();

    this.Is_Export = 0;
    this.CountHierarchy_Emp = 0;

    this.TotalNetPremium = 0.0;
    this.TotalSR = 0;
  }

  Reload() {
    this.Filter1Submitted = 0;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
  ResetDT() {
    this.Filter1Submitted = 0;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

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
              environment.apiUrlBms +
                "/../brokerage/SalesPayoutEdit/GridData?User_Id=" +
                this.api.GetUserId() +
                "&Payout_Mode=" +
                this.Payout_Mode
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBms)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            that.dataAr = resp.data;

            //that.TotalNetPremium = resp.totalPremium['TotalPremium'];
            //that.TotalSR = resp.totalPremium['TotalSR'];
            that.SQL_Where_STR = resp.SQL_Where;

            this.masterSelected = false;
            this.checkedList = [];

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

      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }

  Actions(row_Id): void {
    /*
		const dialogRef = this.dialog.open(SrViewComponent, {
			width: '95%',
			height:'90%',
			data: {Id : row_Id}
		});

		dialogRef.afterClosed().subscribe(result => {
			//   //   console.log(result);
			this.Reload();
		});
		*/

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
}
