import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { BmsapiService } from "../../providers/bmsapi.service";
import { ApiService } from "../../providers/api.service";
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
import { GenerateInvoiceComponent } from "../../modals/brokerage/generate-invoice/generate-invoice.component";
import { isArray } from "util";

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
  selector: "app-invoiceing",
  templateUrl: "./invoiceing.component.html",
  styleUrls: ["./invoiceing.component.css"],
})
export class InvoiceingComponent implements OnInit {
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
  SR_Session_Year: Array<any>;

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

  // SR_Session_Year: any[];
  MonthData: { Id: string; Name: string }[];
  EmployeeType: string;
  currentUrl: string;

  GenerateAgentInvoice = false;
  Selected_Agent_Invoice = false;
  selectedInvoiceIds: any[] = [];
  selectedInvoiceAmount: any[] = [];
  AgentCode: any;
  totalAmount: number = 0;

  constructor(
    public api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private API: ApiService
  ) {
    this.SearchForm = this.fb.group({
      Vertical_Id: ["0"],
      Region_Id: ["0"],
      Sub_Region_Id: ["0"],
      Emp_Id: [""],
      Agent_Id: [""],

      SR_Payout_Type: [""],
      SR_Payout_Status: [""],
      DateOrDateRange: ["", [Validators.required]],
      // FinancialYear: ["", [Validators.required]],
      // Month: ["", [Validators.required]],
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
      //{Id:'2',Name:'RejectByAccounts'},
      { Id: "3", Name: "PendingForBanking" },
      //{Id:'4',Name:'RejectByBanking'},
      { Id: "5", Name: "Approved" },
      { Id: "6", Name: "Paid/PayoutTransfered" },
    ];

    this.MonthData = [
      { Id: "04", Name: "April" },
      { Id: "05", Name: "May" },
      { Id: "06", Name: "June" },
      { Id: "07", Name: "July" },
      { Id: "08", Name: "August" },
      { Id: "09", Name: "September" },
      { Id: "10", Name: "October" },
      { Id: "11", Name: "November" },
      { Id: "12", Name: "December" },
      { Id: "01", Name: "January" },
      { Id: "02", Name: "February" },
      { Id: "03", Name: "March" },
    ];
  }

  ngOnInit(): void {
    // alert(this.Agents_Ar);
    this.Get();

    this.SearchComponentsData();
    // this.commonfilterFieldsData();
  }

  get FC() {
    return this.SearchForm.controls;
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
            this.AccountsUser_Ar = result["Data"]["AccountsUser"];
            this.SR_Session_Year = result["Data"]["FY_Ar"];
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

  //===== DATATABLE FILTER DATA ARRAY =====//
  // commonfilterFieldsData() {
  //   this.API.IsLoading();
  //   this.API
  //     .HttpGetType(
  //       "b-crm/Filter/commonfilterFieldsData?User_Id=" +
  //         this.API.GetUserData("Id") +
  //         "&User_Type=" +
  //         this.API.GetUserType() +
  //         "&portal=Square&empType=" +
  //         this.EmployeeType +
  //         "&EmpId=" +
  //         this.API.GetUserData("Code") +
  //         "&Url=" +
  //         this.currentUrl
  //     )
  //     .then(
  //       (result : any) => {
  //         this.API.HideLoading();
  //         if (result["Status"] == true) {

  //           this.SR_Session_Year = result["Data"]["SR_Session_Year"];
  //         } else {
  //           this.API.Toast("Warning", result["Message"]);
  //         }
  //       },
  //       (err) => {
  //         this.API.HideLoading();
  //         this.API.Toast(
  //           "Warning",
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //       }
  //     );
  // }

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
    this.GenerateAgentInvoice = true;
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

        SR_Payout_Type: fields["SR_Payout_Type"],
        SR_Payout_Status: fields["SR_Payout_Status"],

        FinancialYear: fields["FinancialYear"],
        Month: fields["Month"],

        // To_Date: this.api.StandrdToDDMMYYY(ToDate),
        // From_Date: this.api.StandrdToDDMMYYY(FromDate),
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
                "../../v2/reports/Invoicing/GridData?Payout_Mode=" +
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
          // console.log(result);
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

  GenerateInvoice(id: any, amt: any[], agentcode: any) {
    if (Array.isArray(amt)) {
      amt.forEach((amount) => {
        this.totalAmount += amount;
      });
    } else {
      this.totalAmount = amt;
    }

    //   //   //   console.log(this.totalAmount);

    const dialogRef = this.dialog.open(GenerateInvoiceComponent, {
      width: "50%",
      height: "60%",
      disableClose: true,
      data: { Id: id, Amount: this.totalAmount, agentcode: agentcode },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }

  onSelectCheckbox(
    Generated_Invoice_Id: any,
    Generated_Invoice_Amount: any,
    AgentCode: any
  ) {
    this.Selected_Agent_Invoice = true;
    if (!this.selectedInvoiceIds.includes(Generated_Invoice_Id)) {
      this.selectedInvoiceIds.push(Generated_Invoice_Id);
      this.selectedInvoiceAmount.push(Generated_Invoice_Amount);
      this.AgentCode = AgentCode;
    }
  }
}
