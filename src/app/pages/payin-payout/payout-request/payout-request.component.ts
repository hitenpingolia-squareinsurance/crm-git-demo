import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

import { ViewSrDetailsComponent } from "../../../modals/view-sr-details/view-sr-details.component";
import { SrPostingViewGroupWiseComponent } from "../../../modals/sr-posting-view-group-wise/sr-posting-view-group-wise.component";
import { DownloadingViewComponent } from "../../../modals/downloading-view/downloading-view.component";

class ColumnsObj {
  Id: string;
  isSelected: any;
  Agent_Id: any;
  SR_No: string;
  Add_Stamp: string;
  //SR_Source: string;
  //SR_Status: string;
  LOB_Name: string;
  //File_Type: string;
  Segment_Id: string;
  Product_Id: string;
  SubProduct_Id: string;
  //Class_Id: string;
  //Sub_Class_Id: string;
  //Net_Premium: string;
  //Estimated_Gross_Premium: string;
  //PayoutDetails: string;
  //Customer_Name: string;
  Agent_Name: string;
  RM_Name: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
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

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  isSubmitted = false;
  SQL_Where_STR: any;

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  Companies_Ar: Array<any>;
  Products_Ar: Array<any>;
  AccountsUser_Ar: Array<any>;
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

  Status: any = "";
  Assign_User: any = "";
  Remark: any = "";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  selectedFiles: File;

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
      if (router.url.toString() == "/payout-request/pending-for-accounts") {
        this.ActivePage = "Pending For Accounts";
        this.SR_Payout_Status_Ar = [
          { Id: "1", Name: "PendingForAccounts" },
          { Id: "2", Name: "RejectByAccounts" },
        ];
      } else if (
        router.url.toString() == "/payout-request/pending-for-banking"
      ) {
        this.ActivePage = "Pending For Banking";
        this.SR_Payout_Status_Ar = [
          { Id: "3", Name: "PendingForBanking" },
          { Id: "4", Name: "RejectByBanking" },
        ];
      } else if (router.url.toString() == "/payout-request/final-approved") {
        this.ActivePage = "Approved/PayoutTransferred";
        this.SR_Payout_Status_Ar = [
          { Id: "5", Name: "Approved" },
          { Id: "6", Name: "Paid/PayoutTransfered" },
        ];
      } else {
        this.ActivePage = "";
      }
    });

    this.SearchForm = this.fb.group({
      Vertical_Id: ["0"],
      Region_Id: ["0"],
      Sub_Region_Id: ["0"],
      Emp_Id: [""],
      SRAgent_Type: [""],
      Agent_Id: [""],

      SR_Payout_Status: [""],
      DateOrDateRange: [""],
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

    this.DisableNextMonth = new Date();
  }

  ngOnInit(): void {
    this.Get();
    this.FilterData();
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
  }

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

  SearchBtn() {
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
      SR_Payout_Status: fields["SR_Payout_Status"],

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
      this.Is_Export = 1;
    });
  }

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
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [10, 25, 50, 100],
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/reports/PayoutPosting/GridDataPayoutPostingRequests?User_Id=" +
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
        this.checkedList.push({ Id: this.dataAr[i].Id });
    }
    //this.checkedList = JSON.stringify(this.checkedList);
    this.checkedList = this.checkedList;
    // console.log(this.checkedList);
  }

  CancelBulkApprove() {
    this.Reload();
    this.masterSelected = false;
    this.checkedList = [];
  }

  BulkApprove() {
    var Is_Confirm = "Are you sure that you want to change status this data?";

    if (confirm(Is_Confirm) == true) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("Assign_User", this.Assign_User);
      formData.append("Remark", this.Remark);
      formData.append("Status", this.Status);
      formData.append("Payout_RequestType", this.ActivePage);
      formData.append("Posting_Ids", JSON.stringify(this.checkedList));

      this.api.IsLoading();
      this.api
        .HttpPostType(
          "reports/PayoutPosting/BulkPayoutRequestsUpdate",
          formData
        )
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

  BulkApproveInModal(): void {
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
      Type: "Bulk",
      Id: 0,
      Payout_RequestType: this.ActivePage,
      AgentName: "",
      Posting_Ids: JSON.stringify(this.checkedList),
    };

    const dialogRef = this.dialog.open(
      SrPostingViewGroupWiseComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.Reload();
    });

    /*
		const dialogRef = this.dialog.open(SrPostingViewGroupWiseComponent, {
		  width: '95%',
		  height:'90%',
		  data: {Type:'Bulk',Id : 0,Payout_RequestType:this.ActivePage,AgentName:'',Posting_Ids:JSON.stringify(this.checkedList) },
		  disableClose : true
		});

		dialogRef.afterClosed().subscribe(result => {
		  // console.log(result);

		  this.Reload();
		  this.masterSelected = false;
		  this.checkedList = [];
		  this.Reload();
		});
		*/
  }

  UpdateUTRSingle(row_Id, Agent_Name): void {
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
      Type: "Bulk",
      Id: 0,
      Payout_RequestType: this.ActivePage,
      AgentName: "",
      Posting_Ids: JSON.stringify([{ Id: row_Id }]),
    };

    const dialogRef = this.dialog.open(
      SrPostingViewGroupWiseComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.Reload();
    });

    /*
		const dialogRef = this.dialog.open(SrPostingViewGroupWiseComponent, {
		  width: '95%',
		  height:'90%',
		  data: {Type:'Bulk',Id : 0,Payout_RequestType:this.ActivePage,AgentName:'',Posting_Ids:JSON.stringify([{Id:row_Id}]) },
		  disableClose : true
		});

		dialogRef.afterClosed().subscribe(result => {
		  // console.log(result);

		  this.Reload();
		  this.masterSelected = false;
		  this.checkedList = [];
		  this.Reload();
		});
		*/
  }

  PostingAction(row_Id, Agent_Name): void {
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
      Type: "Single",
      Id: row_Id,
      Payout_RequestType: this.ActivePage,
      AgentName: Agent_Name,
      Posting_Ids: "",
    };

    const dialogRef = this.dialog.open(
      SrPostingViewGroupWiseComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.Reload();
    });

    /*
		const dialogRef = this.dialog.open(SrPostingViewGroupWiseComponent, {
		  width: '100%',
		  height:'100%',
		  data: {Type:'Single',Id :row_Id,Payout_RequestType:this.ActivePage,AgentName:Agent_Name,Posting_Ids:''},
		  disableClose : true
		});

		dialogRef.afterClosed().subscribe(result => {
		  // console.log(result);
		  this.Reload();
		});
		*/
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
      ReportType: "ExportPostingReport",
      SQL_Where: JSON.stringify([
        { Id: Posting_Id, ActivePage: this.ActivePage },
      ]),
    };

    this.Is_Export = 0;

    const dialogRef = this.dialog.open(DownloadingViewComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }

  ExportExcel() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("User_Type", this.api.GetUserType());

    formData.append("SQL_Where_STR", this.SQL_Where_STR);
    formData.append("ActivePage", this.ActivePage);

    this.api.IsLoading();
    this.api.HttpPostType("reports/UtrExport/Export", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.Reload();

          this.api.Toast("Success", result["Message"]);

          window.open(result["DownloadUrl"]);
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
          this.api.Toast("Warning", "File size is greater than 2 mb");
        } else {
          this.Upload();
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast("Warning", "Please choose vaild file ! Example :- xlsx");
      }
    }
  }

  async Upload() {
    var Is_Confirm = "Are you sure that you want to upload bulk UTR No.?";

    if (confirm(Is_Confirm) == true) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("ExcelFile", this.selectedFiles);
      formData.append("ActivePage", this.ActivePage);

      this.api.IsLoading();
      this.api
        .HttpPostType("reports/UtrExport/UpdateBulkUTR_Via_Excel", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["Status"] == true) {
              this.api.Toast("Success", result["Message"]);
            } else {
              //alert(result['Message']);
              this.api.Toast("Warning", result["Message"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            //// console.log(err.message);
            this.api.Toast("Warning", err.message);
          }
        );
    }
  }
}
