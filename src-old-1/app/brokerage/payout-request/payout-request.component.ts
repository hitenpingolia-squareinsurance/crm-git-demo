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

import { SrPostingViewGroupWiseBmsComponent } from "../../modals/brokerage/sr-posting-view-group-wise-bms/sr-posting-view-group-wise-bms.component";
import { DownloadingViewBmsComponent } from "../../modals/brokerage/downloading-view-bms/downloading-view-bms.component";
import { BrokrageRequestLoaderComponent } from "../../modals/brokerage/brokrage-request-loader/brokrage-request-loader.component";
import { UpdateUtrNoComponent } from "../../modals/brokerage/update-utr-no/update-utr-no.component";

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
  selector: "app-payout-request",
  templateUrl: "./payout-request.component.html",
  styleUrls: ["./payout-request.component.css"],
})
export class PayoutRequestComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

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

  Employee_Placeholder: any = "Select Employee";
  Agents_Placeholder: any = "Select Agent";

  TabsType: any = "Accounts";
  Payout_Mode: any = "";

  Status: any = "";
  Assign_User: any = "";
  Remark: any = "";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  selectedFiles: File;

  Accounts: any;
  Banking: any;
  Approved: any;

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
      //Product_Id: [''],
      //Company_Id: [''],
      //SRLOB: [''],
      //SRStatus: [''],
      //SR_Source_Type: [''],
      SR_Payout_Status: ["", [Validators.required]],
      Priority_Level: [""],
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
    this.SR_Payout_Status_Ar = [
      { Id: "1", Name: "PendingForAccounts" },
      { Id: "2", Name: "RejectByAccounts" },
    ];
  }

  ngOnInit(): void {
    //alert(this.router.url);
    if (this.router.url == "/brokerage/request/advance") {
      this.Payout_Mode = "Advance";
    } else if (this.router.url == "/brokerage/request/weekly") {
      this.Payout_Mode = "Weekly";
    } else if (this.router.url == "/brokerage/request/monthly") {
      this.Payout_Mode = "Monthly";
    } else if (this.router.url == "/brokerage/request/early") {
      this.Payout_Mode = "Early";
    } else if (this.router.url == "/brokerage/request/fortnight") {
      this.Payout_Mode = "Fortnight";
    } else {
      alert("Unkown URI Segment");
    }

    this.Get();

    this.SearchComponentsData();
  }

  get FC() {
    return this.SearchForm.controls;
  }

  TabsTypeClick(t: any) {
    this.api.IsLoading();
    this.TabsType = t;
    this.SearchForm.reset();

    this.Status = "";
    this.Assign_User = "";
    this.Remark = "";
    this.masterSelected = false;
    this.checkedList = [];

    this.dataAr = [];
    this.ResetDT();

    if (this.TabsType == "Accounts") {
      this.SR_Payout_Status_Ar = [
        { Id: "1", Name: "PendingForAccounts" },
        { Id: "2", Name: "RejectByAccounts" },
      ];
    } else if (this.TabsType == "Banking") {
      this.SR_Payout_Status_Ar = [
        { Id: "3", Name: "PendingForBanking" },
        { Id: "4", Name: "RejectByBanking" },
      ];
    } else if (this.TabsType == "Approved") {
      this.SR_Payout_Status_Ar = [
        { Id: "5", Name: "Approved" },
        { Id: "6", Name: "Paid/PayoutTransfered" },
      ];
    }

    setTimeout(() => {
      this.api.HideLoading();
    }, 1000);
  }

  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .Call("sr/Agent/SearchComponentsData?User_Id=" + this.api.GetUserId())
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"]["Vertical"];
            //this.Emps_Ar = result['Data']['Hierarchy']['Employee'];
            this.Companies_Ar = result["Data"]["Ins_Compaines"];
            //this.Products_Ar = result['Data']['Products_Ar'];
            this.Region_Ar = result["Data"]["Region_Ar"];
            this.AccountsUser_Ar = result["Data"]["AccountsUser"];
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

        //LOB : fields['SRLOB'],
        //Product_Id : fields['Product_Id'],
        //Company_Id : fields['Company_Id'],

        //Source : fields['SR_Source_Type'],
        //SR_Status : fields['SRStatus'],
        SR_Payout_Status: fields["SR_Payout_Status"],
        Priority_Level: fields["Priority_Level"],
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
      ReportType: "PayoutRequest",
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
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/brokerage/LPA_PayoutRequest/GridData?Payout_Mode=" +
                this.Payout_Mode +
                "&ActiveTab=" +
                this.TabsType +
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
 


PostInTally(id:any){
  if(confirm("Are you sure?")==true){
  
  const formData = new FormData();
  formData.append("User_Id", this.api.GetUserId());
  formData.append("Id", id);
  this.api
    .HttpPostType(
      "brokerage/Tally",
      formData
    )
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
          this.dataAr[i].Status == 5)
      ) {
        this.checkedList.push({
          Id: this.dataAr[i].Id,
          Status: this.dataAr[i].Status,
        });
      }
    }
    //this.checkedList = JSON.stringify(this.checkedList);
    this.checkedList = this.checkedList;
    // console.log(this.checkedList);
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

      formData.append("ActiveTab", this.TabsType);
      formData.append("Status", this.Status);
      formData.append("Assign_User", this.Assign_User);
      formData.append("Remark", this.Remark);
      formData.append("Payout_Mode", this.Payout_Mode);

      formData.append("checkedList", JSON.stringify(this.checkedList));

      for (var i = 0; i < this.checkedList.length; i++) {
        formData.append("Posting_Ids[]", this.checkedList[i]["Id"]);
      }

      this.api.IsLoading();
      this.api
        .HttpPostType("brokerage/LPA_PayoutRequest/PrepareRequest", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              //this.masterSelected = false;
              //this.checkedList = [];

              const dialogRef = this.dialog.open(
                BrokrageRequestLoaderComponent,
                {
                  width: "35%",
                  height: "18%",
                  disableClose: true,
                  data: {
                    Type: "PayoutRequest",
                    Payout_Mode: this.Payout_Mode,
                    TotalRequest: result["TotalRequest"],
                    Store_Id: result["Store_Id"],
                  },
                }
              );

              dialogRef.afterClosed().subscribe((result: any) => {
                // console.log(result);
                //alert('Modal closed');
                this.Status = "";
                this.Assign_User = "";
                this.Remark = "";
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
      //this.Reload();
      this.masterSelected = false;
      this.checkedList = [];
    }
  }

  ViewPartially(row_Id): void {
    var baseurl =
      environment.apiUrl + "/brokerage/LPA_PayoutRequest/ViewPartially";
    var url = baseurl + "?User_Id=" + this.api.GetUserId() + "&Id=" + row_Id;
    window.open(url, "", "fullscreen=no");
    //var iw = window.innerWidth.toFixed();
    //var ih = window.innerHeight.toFixed();
    //alert(iw+'--'+ih);
    //window.open(url,'width=' + (parseInt(iw) * 0.3) + ',height=' + (parseInt(ih) * .3), "fullscreen=no");
  }

  UpdateUTR() {
    const dialogConfig = new MatDialogConfig();
    // console.log(dialogConfig);

    dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = false;
    dialogConfig.maxWidth = "94vw";
    dialogConfig.width = "94%";
    dialogConfig.height = "90%";
    //dialogConfig.position = 'absolute';
    //dialogConfig.hasBackdrop = false;
    //dialogConfig.panelClass = 'modal-popup-full';
    //dialogConfig.closeOnNavigation = false;

    dialogConfig.position = {
      top: "3%",
      left: "3%",
    };

    dialogConfig.data = {
      Posting_Ids: JSON.stringify(this.checkedList),
    };

    const dialogRef = this.dialog.open(UpdateUtrNoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.Reload();
    });
  }

  PostingAction(row_Id, AgentName): void {
    const dialogConfig = new MatDialogConfig();
    // console.log(dialogConfig);

    dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = false;
    dialogConfig.maxWidth = "94vw";
    dialogConfig.width = "94%";
    dialogConfig.height = "90%";

    dialogConfig.position = {
      top: "3%",
      left: "3%",
    };

    dialogConfig.data = {
      Id: row_Id,
      Payout_Mode: this.Payout_Mode,
      ActiveTab: this.TabsType,
      AgentName: AgentName,
    };

    const dialogRef = this.dialog.open(
      SrPostingViewGroupWiseBmsComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.Reload();
    });
  }

  ExportPostingReport(Posting_Id): void {
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
      ReportType: "SingelPostingRequestData",
      SQL_Where: JSON.stringify([{ Id: Posting_Id, ActiveTab: this.TabsType }]),
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

  promptfn() {
    var msg = prompt("Please Enter Adjustment Amount", "");
    if (msg == null) {
      return "";
    } else if (msg == "") {
      return this.promptfn();
    } else if (isNaN(parseInt(msg))) {
      return this.promptfn();
    } else {
      return msg;
    }
  }

  UpdateSettementAmount(Id) {
    var amt = this.promptfn();
    // console.log(amt);

    if (amt != "") {
      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Posting_Id", Id);
      formData.append("Settlement_Amt", amt);

      this.api
        .HttpPostType(
          "brokerage/LPA_PayoutRequest/UpdateSettlement_Amount",
          formData
        )
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

  promptMFfn(m, a) {
    var msg = prompt(m, a);
    if (msg == null) {
      return "";
    } else if (msg == "") {
      return this.promptMFfn("Please Enter MF Fund Amount", a);
    } else if (isNaN(parseInt(msg))) {
      return this.promptMFfn("Please Enter valid MF Fund Amount", a);
    } else {
      return msg;
    }
  }

  Add_MF_Amount(Id, Total_Gross_Amount) {
    var amt = this.promptMFfn(
      "Please Enter MF Fund Amount",
      Total_Gross_Amount
    );
    // console.log(amt);

    if (amt != "") {
      if (Total_Gross_Amount < amt) {
        alert(
          "MF Fund amount should be less than or equal to Total Gross amount!"
        );
        return;
      }

      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("Posting_Id", Id);
      formData.append("MF_Amt", amt);

      this.api
        .HttpPostType("brokerage/LPA_PayoutRequest/Add_MF_Amount", formData)
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

  ImportUTRExcel(event) {
    this.selectedFiles = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      // console.log(this.selectedFiles);
      // console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      //// console.log(ext);

      if (ext == "xlsx") {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size+ ' kb');

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.ErrorMsg("File size is greater than 2 mb");
        } else {
          this.Upload();
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.ErrorMsg("Please choose vaild file ! Example :- xlsx");
      }
    }
  }

  async Upload() {
    const Is_Confirm = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to upload bulk UTR No.?",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
    });

    if (Is_Confirm) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());
      formData.append("ExcelFile", this.selectedFiles);

      this.api.IsLoading();
      this.api
        .HttpPostType(
          "brokerage/LPA_PayoutRequest/UpdateBulkUTR_Via_Excel",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["Status"] == true) {
              //this.api.ToastMessage(result['Message']);

              const dialogRef = this.dialog.open(
                BrokrageRequestLoaderComponent,
                {
                  width: "35%",
                  height: "18%",
                  disableClose: true,
                  data: {
                    Type: "UpdateUTRNo",
                    Payout_Mode: "",
                    TotalRequest: result["TotalRequest"],
                    Store_Id: result["Store_Id"],
                  },
                }
              );

              dialogRef.afterClosed().subscribe((result: any) => {
                // console.log(result);
                //alert('Modal closed');
                this.Reload();
              });
            } else {
              //alert(result['Message']);
              this.api.ErrorMsg(result["Message"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            //// console.log(err.message);
            this.api.ErrorMsg(err.message);
          }
        );
    }
  }

  SharePrevious() {
    var msg = prompt("Please Enter Request Id", "");
    if (msg == null) {
      return "";
    } else if (msg == "") {
      return this.SharePrevious();
    } else {
      return msg;
    }
  }

  SharePreviousStep() {
    var RequestId = this.SharePrevious();

    if (RequestId != "") {
      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("RequestId", RequestId);
      this.api
        .HttpPostType("brokerage/LPA_PayoutRequest/PushBackStep", formData)
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
