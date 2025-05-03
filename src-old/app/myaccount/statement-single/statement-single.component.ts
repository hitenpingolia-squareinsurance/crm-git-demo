import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";

import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";

import { Router } from "@angular/router";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

import { ViewPoPolicesComponent } from "../../modals/view-po-polices/view-po-polices.component";
import { DownloadingViewComponent } from "../../modals/downloading-view/downloading-view.component";

class ColumnsObj {
  Id: string;
  isSelected: any;
  Agent_Id: any;

  Add_Stamp: string;

  Agent_Name: string;
  RM_Name: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  total_po: number;
  total_paid: number;
  total_unpaid: number;
  recordsTotal: number;
  PostingCountAr: any;
}

@Component({
  selector: "app-statement-single",
  templateUrl: "./statement-single.component.html",
  styleUrls: ["./statement-single.component.css"],
})
export class StatementSingleComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  TotalPendingForPosting: number = 0;
  TotalPendingForAccounts: number = 0;
  TotalRejectByAccounts: number = 0;
  TotalPendingForBanking: number = 0;
  TotalRejectByBanking: number = 0;
  TotalApproved: number = 0;
  TotalPaid: number = 0;

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  isSubmitted = false;

  buttonDisable = false;

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  Companies_Ar: Array<any>;
  Products_Ar: Array<any>;
  AccountsUser_Ar: Array<any>;
  MonthsYear_Ar: any = [];
  Is_Export: any = 0;

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

  ItemVerticalSelection: any = [];
  ItemEmployeeSelection: any = [];
  ItemLOBSelection: any = [];

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select POS";

  DisableNextMonth: any;

  Assign_User: any = "";
  Remark: any = "";

  AdditonalCCEmail: any = "";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  maxDate = new Date();
  minDate = new Date();

  CurrentYear: any;
  SumValueNet: number;
  CC_Mail: string;
  loginId: any;
  DownloadUrl: any;
  total_po: number;
  total_paid: number;
  total_unpaid: number;

  Id: any;
  agentId: any;
  Posting_Month: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Id = data.Agent_Id;
    this.agentId = data.Agent_Id;
    this.Posting_Month = data.Posting_Month;

    var d = new Date();
    this.CurrentYear = d.getFullYear();
    //alert(this.CurrentYear);

    this.SearchForm = this.fb.group({
      Year: [this.CurrentYear],
      From_Month: ["", Validators.required],
      To_Month: ["", Validators.required],
      SearchValue: [""],
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

    this.SRLOB_Ar = [
      { Id: "Motor", Name: "Motor" },
      { Id: "Health", Name: "Health" },
    ];
    this.SRSource_Ar = [
      { Id: "BMS", Name: "Offline" },
      { Id: "Web", Name: "Online" },
      { Id: "Excel", Name: "Excel" },
    ];
    this.SR_Payout_Status_Ar = [
      { Id: "0", Name: "PendingForPosting" },
      { Id: "1", Name: "PendingForAccounts" },
      { Id: "2", Name: "RejectByAccounts" },
      { Id: "3", Name: "PendingForBanking" },
      { Id: "4", Name: "RejectByBanking" },
      { Id: "5", Name: "Approved" },
      { Id: "6", Name: "Paid/PayoutTransferred" },
    ];

    //this.DisableNextMonth = new Date();

    this.minDate.setDate(this.minDate.setFullYear(2001));
    this.maxDate.setDate(this.maxDate.getDate() - this.maxDate.getDate());
    this.loginId = this.api.GetUserId();
  }

  ngOnInit(): void {
    this.Get();
    //this.FilterData();
  }

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
            this.MonthsYear_Ar = result["Data"]["MonthsYear_Ar"];
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

  onItemSelect(item: any, Type: any) {
    // console.log("Type : " + Type);
    // console.log("onItemSelect", item);

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
  }

  onItemDeSelect(item: any, Type: any) {
    // console.log("Type : " + Type);
    // console.log("onDeSelect", item);

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
  }

  GetEmployees() {
    this.Emps_Ar = [];
    this.Agents_Ar = [];

    this.SearchForm.get("Emp_Id").setValue(null);
    this.SearchForm.get("Agent_Id").setValue(null);

    this.buttonDisable = true;

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
            this.buttonDisable = false;

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

  get FC() {
    return this.SearchForm.controls;
  }

  SearchBtn() {
    //// console.log(this.SearchForm.value);

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
        User_Id: this.api.GetUserData("Id"),
        User_Type: this.api.GetUserType(),

        Year: fields["Year"],
        From_Month: fields["From_Month"],
        To_Month: fields["To_Month"],
        SearchValue: fields["SearchValue"],
      };

      // console.log(query);

      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
        //this.Is_Export = 1;
      });
    } //else
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.SearchForm.get("Year").setValue(this.CurrentYear);
    this.SearchForm.get("From_Month").setValue("0");
    this.SearchForm.get("To_Month").setValue("0");

    this.Emps_Ar = [];
    this.Agents_Ar = [];
    this.Products_Ar = [];

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
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Get() {
    this.buttonDisable = true;

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

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
              environment.apiUrl +
                "/reports/Statement/AgentEarningStatementGridData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Action=Statement&type=detailed&agentId=" +
                this.agentId +
                "&Posting_Month=" +
                this.Posting_Month
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            //this.SumValueNet = resp.SumValueNet;

            this.total_po = resp.total_po;
            this.total_paid = resp.total_paid;
            this.total_unpaid = resp.total_unpaid;

            if (that.dataAr.length > 0) {
              //that.Is_Export = 1;
            }
            this.buttonDisable = false;

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
          targets: [0, 1, 2, 3, 4, 5, 6, 7], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
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

  SendStatement() {
    var Is_Confirm = "Are you sure that you want to change status this data?";

    if (confirm(Is_Confirm) == true) {
      this.buttonDisable = true;

      var fields = this.SearchForm.value;

      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("AdditonalCCEmail", this.AdditonalCCEmail);
      formData.append("Year", fields["Year"]);
      formData.append("From_Month", fields["From_Month"]);
      formData.append("To_Month", fields["To_Month"]);

      formData.append("checkedList", JSON.stringify(this.checkedList));

      for (var i = 0; i < this.checkedList.length; i++) {
        //formData.append('Posting_Ids[]', this.checkedList[i]['Id'] );
        formData.append("Agent_Ids[]", this.checkedList[i]["Agent_Id"]);
      }

      this.api.IsLoading();
      this.api
        .HttpPostType("reports/Statement/SendStatementOnMail", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.Reload();
              this.buttonDisable = false;

              this.masterSelected = false;
              this.checkedList = [];
              this.api.Toast("Success", result["Message"]);
            } else {
              this.api.Toast("Warning", result["Message"]);
              this.buttonDisable = false;
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            //// console.log(err.message);
            this.api.Toast("Warning", err.message);
          }
        );
    } else {
      this.Reload();
      this.masterSelected = false;
      this.checkedList = [];
    }
  }

  ViewPolicies(row_Id): void {
    const dialogConfig = new MatDialogConfig();
    // console.log(dialogConfig);

    dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = false;
    dialogConfig.maxWidth = "94vw";
    dialogConfig.width = "90%";
    dialogConfig.height = "80%";

    dialogConfig.position = {
      top: "5%",
      left: "4%",
    };

    dialogConfig.data = {
      Id: row_Id,
    };

    const dialogRef = this.dialog.open(ViewPoPolicesComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }

  ViewStatementsPDF(Id): void {
    let url =
      environment.apiUrl +
      "/reports/Statement/ViewStatementPDF?type=single&PO_Id=" +
      Id;
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  ViewStatements(Id, Agent_Id, Posting_Month_Year, Type): void {
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

    if (Type == "PartnerStatement") {
      dialogConfig.data = {
        ReportType: "PartnerStatement",
        SQL_Where: Agent_Id + "|" + Posting_Month_Year + "|single|" + Id,
      };
    } else {
      dialogConfig.data = {
        ReportType: "PartnerStatementMail",
        SQL_Where: Agent_Id + "|" + Posting_Month_Year + "|single|" + Id,
      };
    }

    this.Is_Export = 0;

    const dialogRef = this.dialog.open(DownloadingViewComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      if (Type == "PartnerStatementMail") {
        this.DownloadUrl = result.DownloadUrl;

        const formData = new FormData();

        formData.append("User_Id", this.api.GetUserId());
        formData.append("PO_Id", Id);
        formData.append("Agent_Id", Agent_Id);
        formData.append("Posting_Month_Year", Posting_Month_Year);
        formData.append("ExcelDownloadUrl", this.DownloadUrl);
        formData.append("CC_Mail", this.CC_Mail);

        this.api.IsLoading();
        this.api.HttpPostType("/reports/Statement/SendMail", formData).then(
          (result) => {
            this.api.HideLoading();

            alert(result["Message"]);
            if (result["Status"] == true) {
              this.CC_Mail = "";
            } else {
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            //// console.log(err.message);
            this.api.Toast("Warning", err.message);
          }
        );
      }
    });
  }
  promptfn(m) {
    var msg = prompt(m, "");
    if (msg == null) {
      return "";
    }
    if (msg == "") {
      return m;
    } else {
      return msg;
    }
  }

  SendMail(Id, Agent_Id, Posting_Month_Year) {
    var email = "";
    email = this.promptfn("Please Enter CC Email (optional)");

    if (email != "") {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        this.CC_Mail = email;
        this.ViewStatements(
          Id,
          Agent_Id,
          Posting_Month_Year,
          "PartnerStatementMail"
        );
      } else {
        alert("You have entered an invalid email address!");
        return false;
      }
    } else {
      this.ViewStatements(
        Id,
        Agent_Id,
        Posting_Month_Year,
        "PartnerStatementMail"
      );
    }
  }
}
