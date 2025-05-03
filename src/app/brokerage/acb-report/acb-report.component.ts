import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { BmsapiService } from "../../providers/bmsapi.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

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
  selector: "app-acb-report",
  templateUrl: "./acb-report.component.html",
  styleUrls: ["./acb-report.component.css"],
})
export class AcbReportComponent implements OnInit {
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
  Is_Import: any = 1;

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
  CountHierarchy_Emp: any;

  ReportType: string = "Bussiness";

  selectedFiles: File;
  Bulk_Id: any;
  totalUploadFiles: any = 0;
  totalPendingFiles: any = 0;

  constructor(
    public api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Vertical_Id: [],
      Region_Id: ["0"],
      Sub_Region_Id: ["0"],
      Emp_Id: [""],
      Report_Type: [""],
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

    var selectedItemsSR_Status = [{ Id: "Logged", Name: "Logged" }];
    this.SearchForm.get("SRStatus").setValue(selectedItemsSR_Status);

    this.ReportType = "Bussiness";
  }

  ngOnInit() {
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
    ////   //   console.log('Type : '+ Type);
    ////   //   console.log('onItemSelect', item);

    if (Type == "Vertical") {
      this.Emps_Ar = [];
      this.Agents_Ar = [];

      //this.ItemVerticalSelection.push(item.Id);
      ////   //   console.log(this.ItemVerticalSelection);
      this.GetEmployees();
    }

    if (Type == "Employee") {
      this.Agents_Ar = [];

      this.ItemEmployeeSelection.push(item.Id);
      //   //   console.log(this.ItemEmployeeSelection);

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
    ////   //   console.log('Type : '+ Type);
    ////   //   console.log('onDeSelect', item);

    if (Type == "Vertical") {
      this.Emps_Ar = [];
      this.Agents_Ar = [];

      //var index = this.ItemVerticalSelection.indexOf(item.Id);
      //if (index > -1) {
      //this.ItemVerticalSelection.splice(index, 1);
      //}
      ////   //   console.log(this.ItemVerticalSelection);
      this.GetEmployees();
    }

    if (Type == "Employee") {
      this.Agents_Ar = [];

      var index = this.ItemEmployeeSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemEmployeeSelection.splice(index, 1);
      }
      this.ReportTypeFilter(this.ItemEmployeeSelection);

      //   //   console.log(this.ItemEmployeeSelection);
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

    this.SearchForm.get("Emp_Id").setValue(null);
    this.SearchForm.get("Agent_Id").setValue(null);

    var sub_array = [];
    var vrtiar = this.SearchForm.value["Vertical_Id"];

    for (var i = 0; i < vrtiar.length; i++) {
      sub_array.push(vrtiar[i]["Id"]);
    }

    //alert(sub_array.join(","));

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    //formData.append('Type',Type);
    formData.append("Vertical_Id", sub_array.join(","));
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

  ReportTypeFilter(selectionAr) {
    //   //   console.log(selectionAr.length);

    if (selectionAr.length == 1) {
      var sub_array = [];
      var vrtiar = this.SearchForm.value["Vertical_Id"];

      for (var i = 0; i < vrtiar.length; i++) {
        sub_array.push(vrtiar[i]["Id"]);
      }

      this.SearchForm.get("Report_Type").enable();
      this.SearchForm.get("Report_Type").updateValueAndValidity();

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Vertical_Id", sub_array.join(","));
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
      Report_Type: fields["Report_Type"],
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

    //   //   //   console.log(query);

    this.Is_Export = 0;
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
              environment.apiUrlBms +
                "/../../v3/reports/AcbReport/GridData?portal=bms&Report_Type=" +
                this.ReportType +
                "&User_Id=" +
                this.api.GetUserId()
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBms)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            this.api.HideLoading();

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
        { data: "Estimated_Gross_Premium" },
        { data: "Add_Stamp" },
        { data: "SR_Current_Status" },
      ],
      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }

  ExportExcel() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("query", this.SQL_Where_STR);

    this.api.IsLoading();
    this.api.HttpPostType("../v3/reports/AcbReport/ExportExcel", formData).then(
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
        //   //   console.log(err.message);
        this.api.ErrorMsg(err.message);
      }
    );
  }

  UploadExcel(event) {
    this.selectedFiles = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      //   //   console.log(this.selectedFiles);
      //   //   console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      //   //   console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      ////   //   console.log(ext);

      if (ext == "xlsx") {
        //   //   console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        //   //   console.log(Total_Size + " kb");

        if (Total_Size >= 1024 * 20) {
          // allow only 2 mb
          this.api.ErrorMsg("File size is greater than 20 mb");
        } else {
          this.Is_Import = 0;
          this.Upload();
        }
      } else {
        //   //   console.log("Extenstion is not vaild !");

        this.api.ErrorMsg("Please choose vaild file ! Example :- xlsx");
      }
    }
  }

  Upload() {
    this.totalUploadFiles = 0;
    this.totalPendingFiles = 0;

    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("ExcelFile", this.selectedFiles);

    this.api.IsLoading();
    this.api.HttpPostType("../v3/reports/AcbReport/upload", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.Bulk_Id = result["Bulk_Id"];

          this.totalUploadFiles = result["totalUploadFiles"];

          this.Update_Copy_Data();
        } else {
          //alert(result['Message']);
          this.Is_Import = 1;
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        ////   //   console.log(err.message);
        this.api.ErrorMsg(err.message);
      }
    );
  }

  Update_Copy_Data() {
    const formData = new FormData();

    formData.append("Bulk_Id", this.Bulk_Id);

    this.api.IsLoading();
    this.api
      .HttpPostType("../v3/reports/AcbReport/Update_Copy_Data", formData)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.totalPendingFiles = result["totalPendingFiles"]; //(this.totalUploadFiles-result['totalPendingFiles']);

            this.Update_Copy_Data();
          } else {
            alert(result["Message"]);
            //this.api.Toast('success',result['Message']);
          }
        },
        (err) => {
          this.api.HideLoading();
          ////   //   console.log(err.message);
          this.api.ErrorMsg(err.message);
        }
      );
  }

  Actions(row_Id): void {
    //SrViewComponent SalesSrActionComponent
    // const dialogRef = this.dialog.open(SrViewComponent, {
    //   width: '95%',
    //   height:'90%',
    //   data: {Id : row_Id}
    // });
    // dialogRef.afterClosed().subscribe(result => {
    ////   //   //   console.log(result);
    //   //this.Reload();
    // });
  }
  ViewDocuments(row_Id): void {
    // const dialogRef = this.dialog.open(AgentSrDocumentsComponent, {
    //   width: '95%',
    //   height:'90%',
    //   data: {Id : row_Id}
    // });
    // dialogRef.afterClosed().subscribe(result => {
    ////   //   //   console.log(result);
    // });
  }

  EditSR(row_Id): void {
    //EditSrComponent SrEditByRightComponent
    // const dialogRef = this.dialog.open(EditSrComponent, {
    //   width: '95%',
    //   height:'90%',
    //   data: {Id : row_Id},
    //   //disableClose : true,
    // });
    // dialogRef.afterClosed().subscribe(result => {
    ////   //   //   console.log(result);
    // });
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
		  //   //   console.log(result);
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
    // const dialogRef = this.dialog.open(EditsrpayoutComponent, {
    //   width: '65%',
    //   height:'52%',
    //   data: {Id : row_Id,Edit_Index:Index}
    // });
    // dialogRef.afterClosed().subscribe(result => {
    // //   //   //   console.log(result);
    //    this.Reload();
    // });
  }

  AssignTo_OPS(row_id: any) {
    var Emp_Code = "";
    Emp_Code = this.promptfn("Please Enter Employee Code");

    if (Emp_Code != "") {
      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("SR_Id", row_id);
      formData.append("Emp_Code", Emp_Code);

      this.api
        .HttpForSR("post", "../../v2/sr/Submit/AssignTo_OPS", formData)
        .then(
          (result) => {
            if (result["Status"] == true) {
              this.api.ToastMessage(result["Message"]);
              this.Reload();
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
    }
  }
}
