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

// import { SrPostingViewGroupWiseComponent } from '../../../modals/sr-posting-view-group-wise/sr-posting-view-group-wise.component';
import { DownloadingViewBmsComponent } from "src/app/modals/brokerage/downloading-view-bms/downloading-view-bms.component";
// import { BrokrageRequestLoaderComponent } from '../../../modals/brokrage-request-loader/brokrage-request-loader.component';
// import { PartnerEarningViewComponent } from '../../../modals/partner-earning-view/partner-earning-view.component';

class ColumnsObj {
  Id: string;
  isSelected: any;
  Status: any;
  Action: string;
  RequestDate: string;
  Agent: string;
  Pending: string;
  Approved: string;
  Rejected: string;
  TotalFiles: string;
  Group_Id: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  totalPremium: any[];
  SQL_Where: any;
}

@Component({
  selector: "app-partner-earning",
  templateUrl: "./partner-earning.component.html",
  styleUrls: ["./partner-earning.component.css"],
})
export class PartnerEarningComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  TotalNetPremium: number = 0.0;
  TotalSR: number = 0;
  SQL_Where_STR: any;

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
  AccountsUser_Ar: Array<any>;

  Is_Export: any = 0;

  SRLOB_Ar: any = [];
  SRStatus_Ar: any = [];
  SRSource_Ar: any = [];
  SR_Payout_Type_Ar: any = [];
  SR_Payout_Status_Ar: any = [];

  vertical_dropdownSettings: any = {};
  dropdownSettings: any = {};
  AgentdropdownSettings: any = {};
  LOB_dropdownSettings: any = {};

  ItemVerticalSelection: any = [];
  ItemEmployeeSelection: any = [];
  ItemLOBSelection: any = [];

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";

  TabsType: any = "Accounts";
  Payout_Mode: any = "";

  Status: any = "";
  Assign_User: any = "";
  Remark: any = "";

  AdditonalCCEmail: any = "";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  selectedFiles: File;

  RequestType: any = "";
  DownloadUrl: any = "";
  CC_Mail: any = "";
  FY_Ar: any = [];
  Months_Ar: any = [];

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
      Emp_Id: ["", [Validators.required]],
      Agent_Id: [""],

      FY: [""],
      Month: ["", [Validators.required]],
      //SR_Payout_Status: ['',[Validators.required]],
      //DateOrDateRange: ['',[Validators.required]],
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

    this.SRLOB_Ar = [
      { Id: "Motor", Name: "Motor" },
      { Id: "Non Motor", Name: "Non Motor" },
      { Id: "Health", Name: "Health" },
    ];
    this.SRStatus_Ar = [
      { Id: "Complete", Name: "Booked" },
      { Id: "Pending", Name: "UnBooked" },
      { Id: "Cancelled", Name: "Cancelled" },
    ];
    this.SRSource_Ar = [
      { Id: "BMS", Name: "Offline" },
      { Id: "Web", Name: "Online" },
      { Id: "Excel", Name: "Excel" },
    ];

    this.SR_Payout_Type_Ar = [
      { Id: "Web", Name: "IRDAI" },
      { Id: "BMS", Name: "INFRA" },
    ];

    this.SR_Payout_Status_Ar = [
      { Id: "1", Name: "PendingForAccounts" },
      { Id: "2", Name: "RejectByAccounts" },
      { Id: "3", Name: "PendingForBanking" },
      { Id: "4", Name: "RejectByBanking" },
      { Id: "5", Name: "Approved" },
      { Id: "6", Name: "Paid/PayoutTransfered" },
    ];

    if (this.router.url == "/brokerage/all-po-requests") {
      this.RequestType = "Admin";
    } else if (this.router.url == "/sales-brokerage/partner-earning") {
      this.RequestType = "RM";
    } else {
      alert("Unkown URI Segment");
    }
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
      .Call(
        "sr/Agent/SearchComponentsData?request_page=PO-Statment&Role=" +
          this.api.GetUserData("User_Role") +
          "&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.FY_Ar = result["Data"]["FY_Ar"];
            //this.Emps_Ar = result['Data']['Hierarchy']['Employee'];
            this.Companies_Ar = result["Data"]["Ins_Compaines"];
            //this.Products_Ar = result['Data']['Products_Ar'];
            this.Region_Ar = result["Data"]["Region_Ar"];
            this.AccountsUser_Ar = result["Data"]["AccountsUser"];

            this.SearchForm.get("FY").setValue(result["Data"]["CurrentFY"]);
            this.SearchForm.get("FY").updateValueAndValidity();

            this.GetMonths(result["Data"]["CurrentFY"], 1);
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

  GetMonths(e: any, Type) {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    //formData.append('Type',Type);
    if (Type == 1) {
      formData.append("FY_Id", e);
    } else {
      formData.append("FY_Id", e.target.value);
    }

    this.api.HttpPostType("sr/AgentTest/GetMonthAccording_FY", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Months_Ar = result["Data"];
          this.SearchForm.get("Month").setValue(this.Months_Ar[0]);
          this.SearchForm.get("Month").updateValueAndValidity();
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.ErrorMsg("Network Error, Please try again ! " + err.message);
      }
    );
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
      //   //   console.log(this.ItemEmployeeSelection);
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
      //   //   console.log(this.ItemVerticalSelection);
      //this.GetEmployees('OneByOneDeSelect');
    }

    if (Type == "Employee") {
      this.Agents_Ar = [];

      var index = this.ItemEmployeeSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemEmployeeSelection.splice(index, 1);
      }
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

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("Role", this.api.GetUserData("User_Role"));
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
    formData.append("User_Id", this.api.GetUserId());
    formData.append("Role", this.api.GetUserData("User_Role"));

    this.api
      .HttpPostType("sr/AgentTest/GetAgents_Without_MergeCode", formData)
      .then(
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

    var query = {
      Role: this.api.GetUserData("UserType_Name"),

      Vertical_Id: fields["Vertical_Id"],
      Region_Id: fields["Region_Id"],
      Sub_Region_Id: fields["Sub_Region_Id"],

      Emp_Id: fields["Emp_Id"],
      Agent_Id: fields["Agent_Id"],

      FY: fields["FY"],
      Month: fields["Month"],
      GlobalSearch: GlobalSearch,
      //SR_Payout_Type : fields['SR_Payout_Type'],
      //SR_Payout_Status : fields['SR_Payout_Status'],

      //To_Date : this.api.StandrdToDDMMYYY(ToDate),
      //From_Date : this.api.StandrdToDDMMYYY(FromDate),
    };

    //   //   console.log(query);

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
    ////   //   console.log(this.SQL_Where_STR);
    const dialogConfig = new MatDialogConfig();
    //   //   console.log(dialogConfig);

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
      ReportType: "PayoutRequest",
      SQL_Where: this.SQL_Where_STR,
    };

    this.Is_Export = 0;

    const dialogRef = this.dialog.open(
      DownloadingViewBmsComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      //   //   console.log(result);
    });
  }

  ClearSearch() {
    this.isSubmitted = false;
    this.isSubmitted1 = false;
    this.SearchForm.reset();
    this.SearchForm1.reset();

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
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBms +
                "/../brokerage/PartnerEarning/GridData?Payout_Mode=" +
                this.Payout_Mode +
                "&ActiveTab=" +
                this.TabsType +
                "&User_Id=" +
                this.api.GetUserId()
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

      /*columns: [{ data: 'Id' }, //orderable : false
					{ data: 'Action' },
					{ data: 'RequestDate' },
					{ data: 'Status' },
					{ data: 'Agent' },
					{ data: 'Pending' },
					{ data: 'Approved' },
					{ data: 'Rejected' },
					{ data: 'TotalFiles' },
					{ data: 'Group_Id' },

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
      if (
        this.dataAr[i].isSelected &&
        (this.dataAr[i].Status == 1 ||
          this.dataAr[i].Status == 3 ||
          this.dataAr[i].Status == 5 ||
          this.dataAr[i].Status == 6)
      ) {
        this.checkedList.push({
          Id: this.dataAr[i].Id,
          Status: this.dataAr[i].Status,
        });
      }
    }
    //this.checkedList = JSON.stringify(this.checkedList);
    this.checkedList = this.checkedList;
    //   //   console.log(this.checkedList);
  }

  CancelTransfer() {
    //this.Reload();
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
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());

      formData.append("Remark", this.Remark);
      formData.append("AdditonalCCEmail", this.AdditonalCCEmail);

      formData.append("checkedList", JSON.stringify(this.checkedList));

      for (var i = 0; i < this.checkedList.length; i++) {
        formData.append("Posting_Ids[]", this.checkedList[i]["Id"]);
      }

      this.api.IsLoading();
      this.api.HttpPostType("brokerage/PO_Mail/Process_Request", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.Reload();
            this.masterSelected = false;
            this.checkedList = [];
            this.Remark = "";
            this.AdditonalCCEmail = "";
            this.api.ToastMessage(result["Message"]);

            //this.masterSelected = false;
            //this.checkedList = [];
            /*
					const dialogRef = this.dialog.open(BrokrageRequestLoaderComponent, {
						width: '35%',
						height:'18%',
						disableClose : true,
						data: {Type:'PayoutRequest', Payout_Mode: this.Payout_Mode, TotalRequest : result['TotalRequest'],Store_Id:result['Store_Id']}
					});

					dialogRef.afterClosed().subscribe(result => {
						//   //   console.log(result);
						//alert('Modal closed');
						this.Status ='';
						this.Assign_User ='';
						this.Remark ='';
						this.masterSelected = false;
						this.checkedList = [];
						this.Reload();
					});
					*/
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
      //this.Reload();
      this.masterSelected = false;
      this.checkedList = [];
    }
  }

  /*
	ViewStatements(Agent_Id): void {


	 const dialogConfig = new MatDialogConfig();
	 //   //   console.log(dialogConfig);

			 //dialogConfig.disableClose = true;
			 //dialogConfig.autoFocus = false;
			 dialogConfig.maxWidth = '94vw';
			 dialogConfig.width = '94%';
			 dialogConfig.height = '90%';
			 //dialogConfig.position = 'absolute';
			 //dialogConfig.hasBackdrop = false;
			 //dialogConfig.panelClass = 'modal-popup-full';
			 //dialogConfig.closeOnNavigation = false;

	 dialogConfig.position = {
		 'top': '3%',
		 left: '3%'
	 };

	 dialogConfig.data = {
		 Id : Agent_Id
	 };

	 this.Is_Export = 0;

	 const dialogRef = this.dialog.open(PartnerEarningViewComponent,dialogConfig);

	 dialogRef.afterClosed().subscribe(result => {
		 //   //   console.log(result);
	 });

 }
 */

  ViewStatements(Id, Agent_Id, Posting_Month_Year, Type): void {
    ////   //   console.log(this.SQL_Where_STR);
    const dialogConfig = new MatDialogConfig();
    //   //   console.log(dialogConfig);

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
        SQL_Where: Agent_Id + "|" + Posting_Month_Year,
      };
    } else {
      dialogConfig.data = {
        ReportType: "PartnerStatementMail",
        SQL_Where: Agent_Id + "|" + Posting_Month_Year,
      };
    }

    this.Is_Export = 0;

    const dialogRef = this.dialog.open(
      DownloadingViewBmsComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      //   //   console.log(result);
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
        this.api
          .HttpPostType("brokerage/PartnerEarning/SendMail", formData)
          .then(
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
              ////   //   console.log(err.message);
              this.api.ErrorMsg(err.message);
            }
          );
      }
    });
  }
  ViewStatementsPDF(Id): void {
    let url =
      environment.apiUrlBms +
      "/../brokerage/PartnerEarning/ViewStatementPDF?PO_Id=" +
      Id;
    window.open(url, "", "left=100,top=50,width=800%,height=600");
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
    //   //   console.log(email);

    if (email != "") {
      if (email.length > 0 && email != "Please Enter CC Email (optional)") {
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
}
