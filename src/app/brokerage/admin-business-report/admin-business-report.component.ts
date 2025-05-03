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

import { EditSrComponent } from "../../modals/brokerage/edit-sr/edit-sr.component";

import { AdminSRCancelComponent } from "../../modals/brokerage/admin-srcancel/admin-srcancel.component";
import { SrEditByRightComponent } from "../../modals/brokerage/sr-edit-by-right/sr-edit-by-right.component";
import { DownloadingViewBmsComponent } from "src/app/modals/brokerage/downloading-view-bms/downloading-view-bms.component";
import { CreateMisReportNameComponent } from "src/app/modals/create-mis-report-name/create-mis-report-name.component";
import { EditsrpayoutComponent } from "../../modals/brokerage/editsrpayout/editsrpayout.component";

class ColumnsObj {
  Id: string;
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
  DateRangeValue: any;
}

@Component({
  selector: "app-admin-business-report",
  templateUrl: "./admin-business-report.component.html",
  styleUrls: ["./admin-business-report.component.css"],
})
export class AdminBusinessReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  SearchForm1: FormGroup;
  isSubmitted = false;
  isSubmitted1 = false;

  /* 
Emps_Ar:Array<any>;
Agents_Ar:Array<any>;
Companies_Ar:Array<any>;

Region_Ar:Array<any>;
Sub_Branch_Ar:Array<any>;
Products_Ar:Array<any>;

Is_Export:any=0;
*/

  //TotalNetPremium:number=0.00;
  //TotalSR:number=0;

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
  DateRangeValue_STR: any;

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
  Is_Export: any = 0;

  SRLOB_Ar: any = [];
  SRStatus_Ar: any = [];
  SRSource_Ar: any = [];
  SRType_Ar: any = [];
  SR_Payout_Mode_Ar: any = [];
  SR_Posting_Status_Ar: any = [];
  UserRights: any = [];

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
      Agent_Id: [""],
      Product_Id: [""],
      Company_Id: [""],
      SRLOB: [""],
      SRStatus: ["", [Validators.required]],
      SR_Source_Type: [""],
      SR_Type: [""],
      SR_Payout_Mode: [""],
      SR_Posting_Status: [""],
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

    /*	
	this.SRLOB_Ar = [{Id:'Motor',Name:'Motor'},{Id:'Non Motor',Name:'Non Motor'},{Id:'Health',Name:'Health'},{Id:'Travel',Name:'Travel'},{Id:'Personal Accident',Name:'Personal Accident'},{Id:'Life-Fresh',Name:'Life Fresh'},{Id:'Life-Renewal',Name:'Life Renewal'},{Id:'Finance',Name:'Finance'}];
	this.SRStatus_Ar = [{Id:'Logged',Name:'Logged'},{Id:'Complete',Name:'Booked'},{Id:'Pending',Name:'UnBooked'},{Id:'Cancelled',Name:'Cancelled'}];
	this.SRSource_Ar = [{Id:'BMS',Name:'Offline'},{Id:'Web',Name:'Online'},{Id:'Excel',Name:'Excel'}];
	this.SRType_Ar = [{Id:'Normal',Name:'Normal'},{Id:'Endorsement',Name:'Endorsement'},{Id:'Short',Name:'Short'},{Id:'Recovery',Name:'Recovery'},{Id:'Extra-Payout',Name:'Extra Reward'}];
	this.SR_Payout_Mode_Ar = [{Id:'Advance',Name:'Daily'},{Id:'Weekly',Name:'Weekly'},{Id:'Monthly',Name:'Monthly'}];
	  
	this.SR_Posting_Status_Ar = [
			{Id:'0',Name:'PendingForPosting'},
			{Id:'1',Name:'PendingForAccounts'},
			{Id:'2',Name:'RejectByAccounts'},
			{Id:'3',Name:'PendingForBanking'},
			{Id:'4',Name:'RejectByBanking'},
			{Id:'5',Name:'Approved'},
			{Id:'6',Name:'Paid/PayoutTransferred'},
			{Id:'7',Name:'Direct-Customer'},
			{Id:'8',Name:'Non PO-Product'},
	];
	*/

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

  get FC1() {
    return this.SearchForm1.controls;
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

            this.SRLOB_Ar = result["Data"]["SRLOB_Ar"];
            this.SRStatus_Ar = result["Data"]["SRStatus_Ar"];
            this.SRType_Ar = result["Data"]["SRType_Ar"];
            this.SRSource_Ar = result["Data"]["SRSource_Ar"];
            this.SR_Payout_Mode_Ar = result["Data"]["SRPayout_Mode_Ar"];
            this.SR_Posting_Status_Ar = result["Data"]["SRPosting_Status_Ar"];
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
    var DateOrDateRange = fields["DateOrDateRange"];

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
      SR_Type: fields["SR_Type"],
      SR_Status: fields["SRStatus"],

      SR_Payout_Mode: fields["SR_Payout_Mode"],
      SR_Posting_Status: fields["SR_Posting_Status"],
      GlobalSearch: GlobalSearch,

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

  ExportExcel(): void {
    //// console.log(this.SQL_Where_STR);

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

    /*
	  const dialogConfig = new MatDialogConfig();
		// console.log(dialogConfig);
		 
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
		  // console.log(result);
		});
		*/
  }

  ExportPivotExcel(): void {
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
      ReportType: "SuperAdminPivot",
      SQL_Where: this.SQL_Where_STR,
      DateRangeValue: this.DateRangeValue_STR,
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

    //this.TotalNetPremium = 0.00;
    //this.TotalSR = 0;
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
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/reports/AdminSrReport/GridData?Report_Type=Bussiness&User_Id=" +
                this.api.GetUserId() +
                "&source=crm"
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
            that.DateRangeValue_STR = resp.DateRangeValue;
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

  SearchBtn_old() {
    //// console.log(this.SearchForm.value);

    var fields = this.SearchForm.value;

    var RM_Id_value,
      Agent_Id_value,
      Department_Id_value,
      Product_Id_value,
      Company_Id_value,
      ToDate,
      FromDate;

    var Emp_Id = fields["Emp_Id"];
    var Agent_Id = fields["Agent_Id"];
    var Department_Id = fields["Department_Id"];
    var Product_Id = fields["Product_Id"];
    var Company_Id = fields["Company_Id"];
    var DateOrDateRange = fields["DateOrDateRange"];
    var Source_value = fields["Source"];
    var LOB_Type_value = fields["LOB_Type"];

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

    // console.log(RM_Id_value);
    // console.log(Agent_Id_value);
    // console.log(Company_Id_value);
    // console.log(Source_value);

    var query = {
      RMId: RM_Id_value,
      AgentId: Agent_Id_value,
      DepartmentId: Department_Id_value,

      Region_Id: fields["Region_Id"],
      Sub_Region_Id: fields["Sub_Region_Id"],

      ProductId: Product_Id_value,
      CompanyId: Company_Id_value,

      Source: Source_value,
      LOB_Type: LOB_Type_value,
      SR_Status: fields["SR_Status"],
      To_Date: this.api.StandrdToDDMMYYY(ToDate),
      From_Date: this.api.StandrdToDDMMYYY(FromDate),
    };

    // console.log(query);

    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
      this.Is_Export = 1;
    });
  }

  ExportExcel_old() {
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
      To_Date: this.api.StandrdToDDMMYYY(ToDate),
      From_Date: this.api.StandrdToDDMMYYY(FromDate),
    };

    // console.log(query);

    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());

    formData.append("query", JSON.stringify(query));

    this.api.IsLoading();
    this.api.HttpPostType("reports/AdminSrReport/ExportExcel", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.api.ToastMessage(result["Message"]);
          window.open(result["DownloadUrl"]);
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
    const dialogRef = this.dialog.open(EditSrComponent, {
      width: "95%",
      height: "90%",
      data: { Id: row_Id },
      //disableClose : true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }

  SrPopup(type, row_Id): void {
    //var baseurl = 'http://localhost:4300/';
    var baseurl = "https://crm.squareinsurance.in/";
    var url =
      baseurl +
      "business-login/form/general-insurance/" +
      type +
      "/bms/" +
      this.api.GetUserId() +
      "/" +
      row_Id +
      "/web";
    window.open(url, "", "fullscreen=yes");
  }

  EditPremium(row_Id) {
    var baseurl = "https://api.policyonweb.com/API/v2/sr/UpdatePremium";
    var url = baseurl + "?User_Id=" + this.api.GetUserId() + "&SR_Id=" + row_Id;
    window.open(
      url,
      "popUpWindow",
      "height=500,width=250,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes"
    );
  }

  /*
  CancelSR(row_Id,SRNo): void {
	  
		const dialogRef = this.dialog.open(AdminSRCancelComponent, {
		  width: '35%',
		  height:'45%',
		  data: {Id : row_Id,SR_No: SRNo},
		  disableClose : true,
		});

		dialogRef.afterClosed().subscribe(result => {
		  // console.log(result);
		});
	  
  }
  */

  promptfn(m) {
    var msg = prompt(m, "");
    if (msg == null) {
      return "";
    }
    if (msg == "") {
      return this.promptfn(m);
    } else {
      return msg;
    }
  }

  Cancel(Id) {
    var remark = "";
    remark = this.promptfn("Please Enter Cancellation Remark");

    if (remark != "") {
      if (
        remark == "ok" ||
        remark == "OK" ||
        remark == "okay" ||
        remark == "OKAY"
      ) {
        alert("Please enter vaild Reason/Remark.");
        return;
      }

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("SR_Id", Id);
      formData.append("Remark", remark);

      this.api.HttpForSR("post", "../../v2/sr/Submit/Cancel_SR", formData).then(
        (result) => {
          if (result["Status"] == true) {
            this.api.ToastMessage(result["Message"]);
            this.Reload();
          } else {
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
        }
      );
    }
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
