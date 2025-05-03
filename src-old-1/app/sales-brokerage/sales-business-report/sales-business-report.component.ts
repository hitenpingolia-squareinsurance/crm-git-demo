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
//import { AgentSrActionComponent } from '../../../modals/agent-sr-action/agent-sr-action.component';

//import { AgentSrDocumentsComponent } from '../../../modals/agent-sr-documents/agent-sr-documents.component';
//import { SalesSrActionComponent } from '../../../modals/sales-sr-action/sales-sr-action.component';
//import { DownloadingViewComponent } from '../../../modals/downloading-view/downloading-view.component';
import { CreateMisReportNameComponent } from "src/app/modals/create-mis-report-name/create-mis-report-name.component";
//import { SrViewComponent } from '../../../modals/sr-view/sr-view.component';
// import { EditPayoutRmComponent } from '../../../modals/edit-payout-rm/edit-payout-rm.component';
// import { SrCancelByUWComponent } from '../../../modals/sr-cancel-by-uw/sr-cancel-by-uw.component';

class ColumnsObj {
  Id: string;
  isSelected: any;
  Posting_Status: any;
  Payout_Custom_Update: any;
  RM_Id: any;
  SR_Type: any;
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
  selector: "app-sales-business-report",
  templateUrl: "./sales-business-report.component.html",
  styleUrls: ["./sales-business-report.component.css"],
})
export class SalesBusinessReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

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
  SR_Current_UsersList_Ar: any = [];
  SR_Current_UsersList_Flag: any = 1;

  SearchForm: FormGroup;
  SearchForm1: FormGroup;
  isSubmitted = false;
  isSubmitted1 = false;

  FY_Ar: Array<any>;
  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  Companies_Ar: Array<any>;
  Products_Ar: Array<any>;
  Is_Export: any = 0;

  SRAgentType_Ar: any = [];
  SR_Broker_Ar: any = [];
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

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  Report_Type: any = "";

  maxDate = new Date();
  minDate = new Date();
  SearchDataVal: number = 0;
  checkLob: any = "motor";

  constructor(
    public api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
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
      SR_Broker: [""],
      SRLOB: [""],
      CurrentUser_Id: [""],
      SRStatus: ["", [Validators.required]],
      SRType: [""],
      SR_Source_Type: [""],
      FY: ["", [Validators.required]],
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
    //this.SRLOB_Ar = [{ Id: 'Motor', Name: 'Motor' }, { Id: 'Non Motor', Name: 'Non Motor' }, { Id: 'Health', Name: 'Health' }, { Id: 'Travel', Name: 'Travel' }, { Id: 'Personal Accident', Name: 'Personal Accident' }, { Id: 'Life-Fresh', Name: 'Life Fresh' }, { Id: 'Life-Renewal', Name: 'Life Renewal' }, { Id: 'Finance', Name: 'Finance' }];
    //this.SRStatus_Ar = [{ Id: 'Logged', Name: 'Logged' }, { Id: 'Complete', Name: 'Booked' }, { Id: 'Pending', Name: 'UnBooked' }, { Id: 'Rejected', Name: 'Rejected' }, { Id: 'Cancelled', Name: 'Cancelled' }];
    //this.SRType_Ar = [{ Id: 'Normal', Name: 'Normal' }, { Id: 'Endorsement', Name: 'Endorsement' }, { Id: 'Short', Name: 'Short' }, { Id: 'Recovery', Name: 'Recovery' }, { Id: 'Extra-Payout', Name: 'Extra Reward' }];
    //this.SRSource_Ar = [{ Id: 'BMS', Name: 'Offline' }, { Id: 'Web', Name: 'Online' }, { Id: 'Excel', Name: 'Excel' }, { Id: 'CRM', Name: 'CRM' }];

    this.selectedItemsSR_Status = [{ Id: "Logged", Name: "Logged" }];

    this.SearchForm.get("SRStatus").setValue(this.selectedItemsSR_Status);
    //this.SearchForm.get('Vertical_Id').setValue(this.api.GetUserData('Department_Id'));
  }

  ngOnInit(): void {
    //alert(this.router.url);

    if (this.router.url == "/reports/my-business-info") {
      this.Report_Type = "Business";
    } else if (this.router.url == "/sales-brokerage/blocked-cases") {
      this.Report_Type = "Blocked Cases";
    } else {
      alert("Unkown URI Segment");
    }

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

  onItemSelectFY(item: any, type: any) {
    //Financial Year
    ////   //   console.log(item.target.value);
    if (type == 1) {
      var Years = item;
    } else {
      var Years = item.target.value;
    }

    var Explods = Years.split("-");
    var Year1 = parseInt(Explods[0]);
    var Year2 = Year1 + 1;
    this.minDate = new Date("04-01-" + Year1);
    this.maxDate = new Date("03-31-" + Year2);
    this.SearchForm.get("DateOrDateRange").setValue("");
    this.SearchForm.get("DateOrDateRange").updateValueAndValidity();
  }

  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .Call("sr/Agent/SearchComponentsData?User_Id=" + this.api.GetUserId())
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.FY_Ar = result["Data"]["FY_Ar"];
            this.Vertical_Ar = result["Data"]["Vertical"];
            //this.Emps_Ar = result['Data']['Hierarchy']['Employee'];
            this.Companies_Ar = result["Data"]["Ins_Compaines"];
            //this.Products_Ar = result['Data']['Products_Ar'];
            this.Region_Ar = result["Data"]["Region_Ar"];
            this.SR_Broker_Ar = result["Data"]["Broker_Ar"];

            this.SRLOB_Ar = result["Data"]["SRLOB_Ar"];
            this.SRStatus_Ar = result["Data"]["SRStatus_Ar"];
            this.SRType_Ar = result["Data"]["SRType_Ar"];
            this.SRSource_Ar = result["Data"]["SRSource_Ar"];

            this.SearchForm.get("FY").setValue(result["Data"]["CurrentFY"]);
            this.SearchForm.get("FY").updateValueAndValidity();
            this.onItemSelectFY(result["Data"]["CurrentFY"], 1);
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
    formData.append("Payout_Mode", this.Report_Type);
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

  SearchData(event: any) {
    //    // console.log(event);
    // alert();
    this.SearchDataVal = 1;
    if (event["LOB"] != "") {
      this.checkLob = event["LOB"][0]["Id"];
    }

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      // alert();
      if (TablesNumber == "Table1") {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
    });
    this.api.IsLoading();
  }

  SearchBtn(FilterType: any) {
    ////   //   console.log(this.SearchForm.value);

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

      Broker: fields["SR_Broker"],
      LOB: fields["SRLOB"],
      Product_Id: fields["Product_Id"],
      Company_Id: fields["Company_Id"],

      CurrentUser_Id: fields["CurrentUser_Id"],
      Source: fields["SR_Source_Type"],
      SR_Status: fields["SRStatus"],
      SR_Type: fields["SRType"],
      GlobalSearch: GlobalSearch,
      FY: fields["FY"],
      To_Date: this.api.StandrdToDDMMYYY(ToDate),
      From_Date: this.api.StandrdToDDMMYYY(FromDate),
    };

    //   //   console.log(query);

    this.masterSelected = false;
    this.checkedList = [];

    this.Is_Export = 0;
    this.SR_Current_UsersList_Flag = 1;
    this.dataAr = [];

    this.api.IsLoading();

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
      //this.Is_Export = 1;
    });
  }

  ExportExcel(): void {
    ////   //   console.log(this.SQL_Where_STR);

    const dialogRef = this.dialog.open(CreateMisReportNameComponent, {
      width: "70%",
      height: "70%",
      //disableClose : true,
      data: { SQL_Where: this.SQL_Where_STR },
    });
    this.Is_Export = 0;
    dialogRef.afterClosed().subscribe((result) => {
      //   //   console.log(result);
    });

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
			//ReportType : 'MotorNonMotorHealth_SR',
			ReportType : 'MotorNonMotorHealth_Customize',
			SQL_Where: this.SQL_Where_STR,
		};

		this.Is_Export = 0;

		const dialogRef = this.dialog.open(DownloadingViewComponent,dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
			//   //   console.log(result);
		});
		*/
  }

  ClearSearch() {
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

    this.masterSelected = false;
    this.checkedList = [];

    this.dataAr = [];
    this.ResetDT();

    this.Is_Export = 0;
    this.CountHierarchy_Emp = 0;

    this.TotalNetPremium = 0.0;
    this.TotalSR = 0;
  }

  Reload() {
    this.masterSelected = false;
    this.checkedList = [];
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
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBms +
                "/../crm/MyBusiness/GridData?Report_Type=" +
                this.Report_Type +
                "&User_Id=" +
                this.api.GetUserId()
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBms)
          )
          .subscribe((res: any) => {
            this.api.HideLoading();
            var resp = JSON.parse(this.api.decryptText(res.response));

            that.dataAr = resp.data;

            //that.TotalNetPremium = resp.totalPremium['TotalPremium'];
            //that.TotalSR = resp.totalPremium['TotalSR'];
            that.SQL_Where_STR = resp.SQL_Where;

            //if(that.SR_Current_UsersList_Flag == 1 ){
            //that.SR_Current_UsersList_Flag=0;
            //that.SR_Current_UsersList_Ar = that.SR_Current_UsersList_Ar.concat(resp.SR_Current_UsersList);
            that.SR_Current_UsersList_Ar = resp.SR_Current_UsersList;
            //}
            //alert(resp.SQL_Where);
            if (that.dataAr.length > 0) {
              that.Is_Export = 1;
            }

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
    var baseurl = "https://crm.squareinsurance.in/";
    var url =
      baseurl +
      "business-login/form/general-insurance/1/bms/" +
      this.api.GetUserId() +
      "/" +
      row_Id +
      "/web";
    window.open(url, "", "fullscreen=yes");
    /*
		const dialogRef = this.dialog.open(SrViewComponent, {
			width: '95%',
			height:'90%',
			data: {Id : row_Id}
		});

		dialogRef.afterClosed().subscribe(result => {
			//   //   console.log(result);
		});
		*/
  }

  UpdatePayout(row_Id): void {
    // const dialogConfig = new MatDialogConfig();
    // console.log(dialogConfig);
    // dialogConfig.disableClose = false;
    // //dialogConfig.autoFocus = false;
    // dialogConfig.maxWidth = '94vw';
    // dialogConfig.width = '94%';
    // dialogConfig.height = '90%';
    // dialogConfig.position = {
    // 	'top': '3%',
    // 	left: '3%'
    // };
    // dialogConfig.data = {
    // 	Id: JSON.stringify([{ Id: row_Id }])
    // };
    // const dialogRef = this.dialog.open(EditPayoutRmComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(result => {
    // 	//   //   console.log(result);
    // });
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
        if (
          this.dataAr[i].Posting_Status == 0 &&
          this.dataAr[i].Payout_Custom_Update == 0 &&
          this.api.GetUserData("User_Id_Dec") == this.dataAr[i].RM_Id &&
          (this.dataAr[i].SR_Type == "Normal" ||
            this.dataAr[i].SR_Type == "Short" ||
            this.dataAr[i].SR_Type == "Endorsement")
        ) {
          this.checkedList.push({
            Id: this.dataAr[i].Id,
          });
        }
      }
    }
    //this.checkedList = JSON.stringify(this.checkedList);
    this.checkedList = this.checkedList;
    //   //   console.log(this.checkedList);
  }

  Cancel() {
    //this.Reload();
    this.masterSelected = false;
    this.checkedList = [];
  }

  UpdateRequest() {
    var Is_Confirm = "Are you sure that you want to change status this data?";

    if (confirm(Is_Confirm) == true) {
      // const dialogConfig = new MatDialogConfig();
      // console.log(dialogConfig);
      // dialogConfig.disableClose = false;
      // //dialogConfig.autoFocus = false;
      // dialogConfig.maxWidth = '94vw';
      // dialogConfig.width = '94%';
      // dialogConfig.height = '90%';
      // dialogConfig.position = {
      // 	'top': '3%',
      // 	left: '3%'
      // };
      // dialogConfig.data = {
      // 	Id: JSON.stringify(this.checkedList)
      // };
      // const dialogRef = this.dialog.open(EditPayoutRmComponent, dialogConfig);
      // dialogRef.afterClosed().subscribe(result => {
      // 	//   //   console.log(result);
      // 	this.Reload();
      // });
      /*
				 const dialogRef = this.dialog.open(EditPayoutRmComponent, {
					width: '95%',
					height:'80%',
					data: {Id : JSON.stringify(this.checkedList) }
				});

				dialogRef.afterClosed().subscribe(result => {
					//   //   console.log(result);
					//this.Reload();
				});
			*/
      /*
			const formData = new FormData();

			formData.append('User_Id',this.api.GetUserId());

			for (var i = 0; i < this.checkedList.length; i++) {
				formData.append('Ids[]', this.checkedList[i]['Id'] );
			}

			this.api.IsLoading();
			this.api.HttpPostType('brokerage/SalesPayoutEdit/UpdateRequestsBulk',formData).then((result) => {
			this.api.HideLoading();

				if(result['Status'] == true){
					//this.Reload();
					this.masterSelected = false;
					this.checkedList = [];
					//this.api.Toast('Success',result['Message']);
					this.api.ToastMessage(result['Message']);
				}else{
					this.api.ErrorMsg(result['Message']);
				}

			}, (err) => {
				// Error log
				this.api.HideLoading();
				////   //   console.log(err.message);
			 this.api.ErrorMsg(err.message);
			});
			*/
    } else {
      //this.Reload();
      this.masterSelected = false;
      this.checkedList = [];
    }
  }

  CancelSR(row_Id, SRNo): void {
    // const dialogRef = this.dialog.open(SrCancelByUWComponent, {
    // 	width: '35%',
    // 	height: '45%',
    // 	data: { Id: row_Id, SR_No: SRNo },
    // 	disableClose: true,
    // });
    // dialogRef.afterClosed().subscribe(result => {
    // 	//   //   console.log(result);
    // 	this.Reload();
    // });
  }
}
