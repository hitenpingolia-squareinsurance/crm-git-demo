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

import { ViewSrDetailsComponent } from "../../modals/view-sr-details/view-sr-details.component";
import { EditSrPayoutComponent } from "../../modals/edit-sr-payout/edit-sr-payout.component";
import { DownloadingViewComponent } from "../../modals/downloading-view/downloading-view.component";

class ColumnsObj {
  Id: string;
  isSelected: any;
  Agent_Id: any;
  Posting_Status_Web: any;
  SR_No: string;
  Add_Stamp: string;
  LOB_Name: string;
  Segment_Id: string;
  Product_Id: string;
  SubProduct_Id: string;
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
  selector: "app-cash-report",
  templateUrl: "./cash-report.component.html",
  styleUrls: ["./cash-report.component.css"],
})
export class CashReportComponent implements OnInit {
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

  TotalPendingForPosting_Amt: number = 0;
  TotalPendingForAccounts_Amt: number = 0;
  TotalRejectByAccounts_Amt: number = 0;
  TotalPendingForBanking_Amt: number = 0;
  TotalRejectByBanking_Amt: number = 0;
  TotalApproved_Amt: number = 0;
  TotalPaid_Amt: number = 0;

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  isSubmitted = false;
  UpdatedStatus: any = "";

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  Companies_Ar: Array<any>;
  Products_Ar: Array<any>;
  AccountsUser_Ar: Array<any>;

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

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  maxDate = new Date();
  minDate = new Date();

  SQL_Where_STR: any;
  Is_Export: any = 0;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.router.events.subscribe((value) => {
      //// console.log(value);
      //// console.log('current route: ', router.url.toString());
      if (router.url.toString() == "/manage-requests/claims") {
        this.ActivePage = "ManageRequests";
      } else {
        this.ActivePage = "Default";
      }
    });

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
      SR_Payout_Status: [""],
      DateOrDateRange: ["", [Validators.required]],
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
      { Id: "Non Motor", Name: "Non Motor" },
    ];
    this.SRSource_Ar = [
      { Id: "BMS", Name: "Offline" },
      { Id: "Web", Name: "Online" },
      { Id: "Excel", Name: "Excel" },
    ];

    //this.DisableNextMonth = new Date();

    this.minDate.setDate(this.minDate.setFullYear(2001));
    this.maxDate.setDate(this.maxDate.getDate() - this.maxDate.getDate());
  }

  ngOnInit(): void {
    this.Get();
    this.FilterData();
  }

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

  //====== ON ITEM SELECT =====//
  onItemSelect(item: any, Type: any) {
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

  //====== ON ITEM SELECT =====//
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
      // console.log(this.ItemLOBSelection);
      this.GetProducts("OneByOneDeSelect");
    }
  }

  //===== GET EMPLOYEES =====//
  GetEmployees(e) {
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
    this.GetEmployees(e);
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

  //===== SEARCH DATA =====//
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
        SR_Type: fields["SRType"],
        //SR_Payout_Status : fields['SR_Payout_Status'],

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

  //===== UPDATE SR STATUS =====//
  async UpdateStatus() {
    var Is_Confirm = "Are you sure that you want to change status this data?";

    if (confirm(Is_Confirm) == true) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("Status", this.UpdatedStatus);
      formData.append("Remark", this.Remark);
      formData.append("checkedList", JSON.stringify(this.checkedList));

      for (var i = 0; i < this.checkedList.length; i++) {
        formData.append("Sr_Ids[]", this.checkedList[i]["Id"]);
      }

      this.api.IsLoading();
      this.api.HttpPostType("reports/CashReport/UpdateStatus", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.Reload();
            this.masterSelected = false;
            this.checkedList = [];
            this.api.Toast("Success", result["Message"]);
          } else {
            this.api.Toast("Warning", result["Message"]);
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

  //===== EXPORT EXCEL =====//
  ExportExcel(): void {
    const dialogConfig = new MatDialogConfig();
    // console.log(dialogConfig);
    dialogConfig.width = "25%";
    dialogConfig.height = "14%";
    dialogConfig.hasBackdrop = false;

    dialogConfig.position = {
      top: "40%",
      left: "1%",
    };

    dialogConfig.data = {
      ReportType: "Posting",
      SQL_Where: this.SQL_Where_STR,
    };

    this.Is_Export = 0;
    const dialogRef = this.dialog.open(DownloadingViewComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }

  //===== CLEAR SEARCH FORM =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.SearchForm.get("Vertical_Id").setValue("0");
    this.SearchForm.get("Region_Id").setValue("0");
    this.SearchForm.get("Sub_Region_Id").setValue("0");

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
  }

  //===== RELAOD DATATABLE =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== GET DATATABLE DATA =====//
  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [10, 25, 50, 100, 500],
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/reports/CashReport/GridData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Action=" +
                this.ActivePage
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

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

      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4, 5, 6, 7], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }

  //===== VIEW DOCUMENTS =====//
  ViewDocument(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  //===== VIEW SR DETAILS =====//
  ViewSR(row_Id): void {
    const dialogRef = this.dialog.open(ViewSrDetailsComponent, {
      width: "95%",
      height: "90%",
      data: { Id: row_Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      //this.Reload();
    });
  }

  //===== CHECK UNCHEK ALL =====//
  checkUncheckAll() {
    for (var i = 0; i < this.dataAr.length; i++) {
      this.dataAr[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  //===== IS ALL SELECTED =====//
  isAllSelected() {
    this.masterSelected = this.dataAr.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  //===== GET CHECKED ITEM LIST =====//
  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.dataAr.length; i++) {
      if (this.dataAr[i].isSelected)
        this.checkedList.push({
          Id: this.dataAr[i].Id,
          SR_No: this.dataAr[i].SR_No,
          Agent_Id: this.dataAr[i].Agent_Id,
          Posting_Status_Web: this.dataAr[i].Posting_Status_Web,
        });
    }
    //this.checkedList = JSON.stringify(this.checkedList);
    this.checkedList = this.checkedList;
  }

  //====== CANCEL TRANSFER =====//
  CancelTransfer() {
    this.Reload();
    this.masterSelected = false;
    this.checkedList = [];
  }

  CancelStatusUpdate() {}

  //===== TRANSFER =====//
  Transfer() {
    var Is_Confirm = "Are you sure that you want to change status this data?";

    if (confirm(Is_Confirm) == true) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("Assign_User", this.Assign_User);
      formData.append("Remark", this.Remark);
      //formData.append('Payout_Mode',this.Payout_Mode);
      formData.append("checkedList", JSON.stringify(this.checkedList));

      for (var i = 0; i < this.checkedList.length; i++) {
        //formData.append('SR_Ids[]', this.checkedList[i]['Id'] );
        formData.append("Agent_Ids[]", this.checkedList[i]["Agent_Id"]);
      }

      this.api.IsLoading();
      this.api
        .HttpPostType("reports/PayoutPosting/TransferRequest", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.Reload();
              this.masterSelected = false;
              this.checkedList = [];
              this.api.Toast("Success", result["Message"]);
            } else {
              this.api.Toast("Warning", result["Message"]);
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

  //===== EDIT PAYOUT =====//
  EditPayout(row_Id, Index): void {
    const dialogRef = this.dialog.open(EditSrPayoutComponent, {
      width: "65%",
      height: "52%",
      data: { Id: row_Id, Edit_Index: Index },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.dataAr[result["UpdateIndex"]]["Web_Agent_Payout_OD"] =
        result["Payout_Update_Columns"]["Web_Agent_Payout_OD"];
      this.dataAr[result["UpdateIndex"]]["Web_Agent_Payout_OD_Amount"] =
        result["Payout_Update_Columns"]["Web_Agent_Payout_OD_Amount"];
      this.dataAr[result["UpdateIndex"]]["Web_Agent_Payout_TP_Amount"] =
        result["Payout_Update_Columns"]["Web_Agent_Payout_TP_Amount"];
      this.dataAr[result["UpdateIndex"]]["Web_Agent_Reward_Amount"] =
        result["Payout_Update_Columns"]["Web_Agent_Reward_Amount"];
      this.dataAr[result["UpdateIndex"]]["Web_Agent_Scheme_Amount"] =
        result["Payout_Update_Columns"]["Web_Agent_Scheme_Amount"];
      this.dataAr[result["UpdateIndex"]]["Web_Agent_Total_Amount"] =
        result["Payout_Update_Columns"]["Web_Agent_Total_Amount"];
    });
  }
}
