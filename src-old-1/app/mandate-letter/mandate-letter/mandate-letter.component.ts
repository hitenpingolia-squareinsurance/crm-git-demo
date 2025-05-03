import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
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

// import { SalesSrActionComponent } from '../../../modals/sales-sr-action/sales-sr-action.component';
import { MandateLetterFormComponent } from "../../modals/mandate-letter/mandate-letter-form/mandate-letter-form.component";
import { MandateLetterQcComponent } from "../../modals/mandate-letter/mandate-letter-qc/mandate-letter-qc.component";
import { DownloadingViewComponent } from "../../modals/downloading-view/downloading-view.component";

class ColumnsObj {
  Id: string;
  SR_No: string;
  LOB_Name: string;
  File_Type: string;
  Customer_Name: string;
  RM_Name: string;
  Estimated_Gross_Premium: string;
  Registration_No: string;
  Add_Stamp: string;
  QC_Status: string;
  Mandate_Status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  SQLWhere: any;
  IsExport: any;
}

@Component({
  selector: "app-mandate-letter",
  templateUrl: "./mandate-letter.component.html",
  styleUrls: ["./mandate-letter.component.css"],
})
export class MandateLetterComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  SearchForm: FormGroup;
  isSubmitted = false;

  BusinessLine_Ar: Array<any>;
  Emps_Ar: Array<any>;
  ReportTypeData: Array<any>;
  Agents_Ar: Array<any>;
  Companies_Ar: Array<any>;
  Products_Ar: Array<any>;
  SelectedReportType: { Id: string; Name: string }[];
  Is_Export: any = 0;

  reportTypeVal: any = "";
  ReportTypeDisable = true;

  SRStatus_Ar: any = [];
  SRSource_Ar: any = [];
  SRType_Ar: any = [];
  SR_Payout_Mode_Ar: any = [];
  UserRights: any = [];
  SQL_Where_STR: any;

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsmultiselect1: any = {};
  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: any = {};

  ItemEmployeeSelection: any = [];
  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";

  Vertical_Ar: any;
  ItemVerticalSelection: any;
  ItemLOBSelection: any;
  SR_Posting_Status_Ar: { Id: string; Name: string }[];

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      Business_Line_Id: [""],
      Vertical_Id: [],
      Emp_Id: [""],
      RM_Search_Type: [""],
      Agent_Id: [""],
      Product_Id: [""],
      Company_Id: [""],
      SRStatus: ["", [Validators.required]],
      SR_Type: [""],
      SR_Posting_Status: [""],
      DateOrDateRange: ["", [Validators.required]],
      SearchValue: [""],
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
    ];

    this.ReportTypeData = [
      { Id: "Self", Name: "Self" },
      { Id: "Team", Name: "Team" },
    ];
    this.SelectedReportType = [{ Id: "Team", Name: "Team" }];

    var selectedItemsSR_Status = [{ Id: "Logged", Name: "Logged" }];
    this.SearchForm.get("SRStatus").setValue(selectedItemsSR_Status);
  }

  ngOnInit(): void {
    this.Get();
    this.SearchComponentsData();
    this.GetProducts("");
  }

  get FC() {
    return this.SearchForm.controls;
  }

  //===== SEARCH COMPONENT DATA =====//
  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "common/Common/SearchComponentsData?User_Code=" +
          this.api.GetUserData("Code") +
          "&Portal=CRM&PageName=Mandate-Letter"
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.BusinessLine_Ar = result["Data"]["Business_Line_Ar"];
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.Companies_Ar = result["Data"]["Ins_Compaines"];
            this.UserRights = result["Data"]["SR_User_Rights"];
          } else {
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
    formData.append("PageName", "Mandate-Letter");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "Business_Line_Id",
      JSON.stringify(this.SearchForm.value["Business_Line_Id"])
    );

    this.api.HttpPostTypeBms("/common/Common/GetVerticalData", formData).then(
      (result) => {
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
    this.SearchForm.get("Emp_Id").setValue("");
    this.SearchForm.get("Agent_Id").setValue("");

    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "Mandate-Letter");
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append(
      "Vertical_Id",
      JSON.stringify(this.SearchForm.value["Vertical_Id"])
    );
    formData.append("Region_Id", "");
    formData.append("Sub_Region_Id", "");

    this.api.HttpPostTypeBms("/common/Common/GetEmployees", formData).then(
      (result) => {
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
      if (e == 1) {
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
      (result) => {
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

  //===== GET PRODUCTS DATA =====//
  GetProducts(Type) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", "Non Motor");
    this.api.HttpPostTypeBms("sr/AgentTest/GetProducts", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Products_Ar = result["Data"];
        } else {
          this.api.Toast("warning", result["Message"]);
        }
      },
      (err) => {
        this.api.Toast(
          "Error",
          "Network Error, Please try again ! " + err.message
        );
      }
    );
  }

  //===== SEARCH FORM DATA =====//
  SearchBtn() {
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
      Emp_Id: fields["Emp_Id"],
      Agent_Id: fields["Agent_Id"],
      Product_Id: fields["Product_Id"],
      Company_Id: fields["Company_Id"],
      SR_Type: fields["SR_Type"],
      SR_Status: fields["SRStatus"],
      SearchValue: fields["SearchValue"],
      To_Date: this.api.StandrdToDDMMYYY(ToDate),
      From_Date: this.api.StandrdToDDMMYYY(FromDate),
    };

    this.Is_Export = 0;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
    });
  }

  //===== CLEAR SEARCH DATA =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Agents_Ar = [];
    this.SelectedReportType = [{ Id: "Team", Name: "Team" }];
    this.ResetDT();
    this.Is_Export = 0;
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== RELOAD DATATABLE =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  //===== GET DATATBLE DATA =====//
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
                "/reports/MandateLetterReport/GridData?&User_Code=" +
                this.api.GetUserData("Code") +
                "&Portal=CRM"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            if (that.dataAr.length > 0) {
              that.Is_Export = resp.IsExport;
              that.SQL_Where_STR = resp.SQLWhere;
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
        { data: "RM_Name" },
        { data: "Estimated_Gross_Premium" },
        { data: "Add_Stamp" },
      ],
    };
  }

  //===== SR POPUP =====//
  SrPopup(type, row_Id): void {
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
              "business-login/form/general-insurance/" +
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

  //===== UPLOAD DOCS =====//
  UploadDocs(row_Id: any, SRNo: any, CurrentStatus: any): void {
    var Width = "35%";
    var Height = "52%";
    if (CurrentStatus == "Rejected") {
      Width = "35%";
      Height = "63%";
    }

    const dialogRef = this.dialog.open(MandateLetterFormComponent, {
      width: Width,
      height: Height,
      data: { Id: row_Id, SR_No: SRNo, CurrentStatus: CurrentStatus },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  //===== MANDATE LETTER QC =====//
  MandateLetterQC(row_Id: any, SRNo: any): void {
    const dialogRef = this.dialog.open(MandateLetterQcComponent, {
      width: "30%",
      height: "44%",
      data: { Id: row_Id, SR_No: SRNo },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  //===== EXPORT EXCEL =====//
  ExportExcel(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = "25%";
    dialogConfig.height = "14%";
    dialogConfig.hasBackdrop = false;

    dialogConfig.position = {
      top: "40%",
      left: "1%",
    };

    dialogConfig.data = {
      ReportType: "Mandate_Letter_Export",
      SQL_Where: this.SQL_Where_STR,
    };

    this.Is_Export = 0;
    const dialogRef = this.dialog.open(DownloadingViewComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }
}
