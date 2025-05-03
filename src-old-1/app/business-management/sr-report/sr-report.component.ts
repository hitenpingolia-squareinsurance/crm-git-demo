import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import swal from "sweetalert";
import { MatDialog } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { SrStatusActionComponent } from "../../modals/sr-status-action/sr-status-action.component";
import { SrCancelActionComponent } from "../../modals/sr-cancel-action/sr-cancel-action.component";
import { CreateMisReportNameComponent } from "../../modals/create-mis-report-name/create-mis-report-name.component";
import { SrRejectedComponent } from "src/app/modals/sr-rejected/sr-rejected.component";

class ColumnsObj {
  Id: string;
  isSelected: any;
  SR_No: string;
  LOB_Name: string;
  File_Type: string;
  Customer_Name: string;
  RM_Name: string;
  Estimated_Gross_Premium: string;
  Add_Stamp: string;
  LI_Status: any;
  Policy_Issuance_Date: string;
  ShowCancelOption: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  Where: any;
  is_accounts: any;
  is_raise_request_view: any;
}

@Component({
  selector: "app-sr-report",
  templateUrl: "./sr-report.component.html",
  styleUrls: ["./sr-report.component.css"],
})
export class SrReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  isSubmitted = false;

  Departments_Ar: Array<any>;

  Vertical_Ar: Array<any>;
  Region_Ar: Array<any>;
  Sub_Branch_Ar: Array<any>;
  Emps_Ar: Array<any>;
  Agents_Ar: Array<any>;
  Companies_Ar: Array<any>;
  Products_Ar: Array<any>;
  Is_Export: any = 0;
  currentUrl: any;
  urlSegment: string;

  Broker_Ar: any = [];
  SRLOB_Ar: any = [];
  SRStatus_Ar: any = [];
  SRSource_Ar: any = [];
  SRType_Ar: any = [];
  SR_Payout_Mode_Ar: any = [];
  SR_Posting_Status_Ar: any = [];
  UserRights: any = [];
  OpsUsers: any = [];

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

  Status: any = "";
  Assign_User: any = "";
  Remark: any = "";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];
  SQL_Where_STR: any;
  loginId: any;
  is_accounts: any = 0;
  is_raise_request_view: any = 0;

  constructor(
    public api: ApiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.loginId = this.api.GetUserId();

    this.SearchForm = this.fb.group({
      Broker_Id: [""],
      Vertical_Id: ["0"],
      Region_Id: ["0"],
      Sub_Region_Id: ["0"],
      Emp_Id: [""],
      Agent_Id: [""],
      Product_Id: [""],
      Company_Id: [""],
      SRLOB: [""],
      //SRStatus: ['',[Validators.required]],
      SR_Source_Type: [""],
      SR_Type: [""],
      SR_Payout_Mode: [""],
      Mode_Of_Payment: [""],
      Request_Type: ["1", [Validators.required]],
      DateOrDateRange: [""],
      GlobalSearch: [""],
      OC_Mapped: [""],
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

    this.SR_StatusDropdownSettings = {
      singleSelection: true,
      enableCheckAll: false,
      idField: "Id",
      textField: "Name",
    };

    //this.SRLOB_Ar = [{Id:'Motor',Name:'Motor'},{Id:'Non Motor',Name:'Non Motor'},{Id:'Health',Name:'Health'},{Id:'LI',Name:'LI'}];
    this.SRSource_Ar = [
      { Id: "CRM", Name: "Offline" },
      { Id: "Web", Name: "Online" },
      { Id: "Excel", Name: "Excel" },
      { Id: "Partner-Login", Name: "Partner-Login" },
    ];
    this.SRType_Ar = [
      { Id: "Normal", Name: "Normal" },
      { Id: "Endorsement", Name: "Endorsement" },
      { Id: "Short", Name: "Short" },
    ];
    this.SR_Payout_Mode_Ar = [
      { Id: "Advance", Name: "Daily" },
      { Id: "Weekly", Name: "Weekly" },
      { Id: "Monthly", Name: "Monthly" },
    ];
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    //Status Array
    if (this.urlSegment == "life-insurance") {
      this.SRStatus_Ar = [
        { Id: "0", Name: "New Requests" },
        { Id: "1", Name: "Pending For Login" },
        { Id: "2", Name: "Case to Insurer" },
        { Id: "3", Name: "Logged" },
        { Id: "4", Name: "Video PLVC/Customer Declaration" },
        { Id: "5", Name: "Pending For Medical" },
        { Id: "6", Name: "Underwriting" },
        { Id: "7", Name: "Pending For Policy Issuance" },
        { Id: "8", Name: "Booked" },
        { Id: "9", Name: "Cancelled Request" },
        { Id: "10", Name: "Cancelled Due To Underwriter" },
        { Id: "11", Name: "Cancelled By Customer" },
      ];
    } else {
      this.SRStatus_Ar = [
        { Id: "Logged", Name: "Logged" },
        { Id: "Complete", Name: "Booked" },
        { Id: "Pending", Name: "UnBooked" },
        { Id: "Cancelled", Name: "Cancelled" },
      ];
    }

    this.Get();
    this.SearchComponentsData();

    // this.logintype=this.api.;
  }

  get FC() {
    return this.SearchForm.controls;
  }

  //===== SEARCH COMPONENT DATA =====//
  SearchComponentsData() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "../v2/sr/QC_Report/Filters?User_Id=" +
          this.api.GetUserData("Code") +
          "&Source=CRM"
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.Broker_Ar = result["Data"]["Broker_Ar"];
            this.OpsUsers = result["Data"]["OpsUsers"];
            this.Vertical_Ar = result["Data"]["Vertical"];
            this.SRLOB_Ar = result["Data"]["LOB_Ar"];
            this.Emps_Ar = [];
            this.Companies_Ar = [];
            this.Products_Ar = [];
            this.Region_Ar = result["Data"]["Region_Ar"];
            this.UserRights = result["Data"]["SR_User_Rights"];
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

  //===== ON ITEM SELECT =====//
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
    if (Type == "LOB") {
      this.ItemLOBSelection.push(item.Id);
      // console.log(this.ItemLOBSelection);
      this.GetProducts("OneByOneSelect");
    }
  }

  //===== ON ITEM DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    //Type = Vertical
    if (Type == "Vertical") {
      this.Emps_Ar = [];
      this.Agents_Ar = [];

      var index = this.ItemVerticalSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemVerticalSelection.splice(index, 1);
      }
    }

    //Type = Employee
    if (Type == "Employee") {
      this.Agents_Ar = [];

      var index = this.ItemEmployeeSelection.indexOf(item.Id);
      if (index > -1) {
        this.ItemEmployeeSelection.splice(index, 1);
      }
      // console.log(this.ItemEmployeeSelection);
      this.GetAgents("OneByOneDeSelect");
    }

    //Type = LOB
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
    formData.append("User_Id", this.api.GetUserData("Code"));
    formData.append("Vertical_Id", this.SearchForm.value["Vertical_Id"]);
    formData.append("Region_Id", this.SearchForm.value["Region_Id"]);
    formData.append("Sub_Region_Id", this.SearchForm.value["Sub_Region_Id"]);
    formData.append("Source", "CRM");

    this.api.HttpPostTypeBms("../v2/sr/QC_Report/GetEmployees", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Emps_Ar = result["Data"];
          this.Employee_Placeholder =
            "Select Employee (" + this.Emps_Ar.length + ")";
          this.Agents_Placeholder = "Select Agent";
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

  //===== GET SUB BRANCHES =====//
  GetSubBranches(e) {
    this.GetEmployees(e);
    this.SearchForm.get("Sub_Region_Id").setValue("0");
    var Branch_Id = e.target.value;

    this.api.IsLoading();
    this.api
      .CallBms(
        "reports/AdminSrReport/GetSubBranches?Branch_Id=" +
          Branch_Id +
          "&User_Id=" +
          this.api.GetUserData("Code") +
          "&Source=CRM"
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

  //===== GET AGENTS DATA =====//
  GetAgents(Type) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("RM_Ids", this.ItemEmployeeSelection.join());

    this.api.HttpPostTypeBms("sr/AgentTest/GetAgents", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Agents_Ar = result["Data"];
          this.Agents_Placeholder =
            "Select Agents (" + this.Agents_Ar.length + ")";
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

  //===== GET PRODUCTS DATA =====//
  GetProducts(Type) {
    this.SearchForm.get("Product_Id").setValue(null);
    this.SearchForm.get("Company_Id").setValue(null);

    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", JSON.stringify(this.SearchForm.value["SRLOB"]));

    this.api.HttpPostTypeBms("../v2/sr/QC_Report/GetProducts", formData).then(
      (result) => {
        if (result["Status"] == true) {
          this.Products_Ar = result["Data"]["Product"];
          this.Companies_Ar = result["Data"]["Ins_Compaines"];
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

  //===== SEARCH DATATABLE DATA =====//
  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      // console.log(this.SearchForm.value);

      var fields = this.SearchForm.value;
      // console.log(fields["Broker_Id"]);

      var DateOrDateRange = fields["DateOrDateRange"];
      var ToDate, FromDate;

      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      var query = {
        Role: this.api.GetUserData("UserType_Name"),

        Broker_Id: fields["Broker_Id"],
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
        Request_Type: fields["Request_Type"],
        Mode_Of_Payment: fields["Mode_Of_Payment"],
        GlobalSearch: fields["GlobalSearch"],
        OC_Mapped: fields["OC_Mapped"],

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
      });
    }
  }

  //===== CLEAR SEARCH DATA =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.SearchForm.get("Vertical_Id").setValue("0");
    this.SearchForm.get("Region_Id").setValue("0");
    this.SearchForm.get("Sub_Region_Id").setValue("0");
    this.SearchForm.get("OC_Mapped").setValue("");
    this.SearchForm.get("Mode_Of_Payment").setValue("");

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
  }

  //===== RELOAD DATATABLE =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //===== RESET DATATABLE DATA =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== GET DATATABLE DATA =====//
  Get() {
    const that = this;

    this.dtOptions = {
      pageLength: 10,
      serverSide: true,
      processing: true,
      //  dom: 'ilpftripl',
      // searching: false,

      //dom: 'lrt',
      // paging: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/../v2/sr/QC_Report/Grid?User_Id=" +
                this.api.GetUserData("Code") +
                "&Source=CRM&UrlSegment=" +
                this.urlSegment
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            that.SQL_Where_STR = resp.Where;
            that.is_accounts = resp.is_accounts;
            that.is_raise_request_view = resp.is_raise_request_view;

            if (that.dataAr.length > 0) {
              that.Is_Export = 1;
            } else {
              that.Is_Export = 0;
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
          targets: [0], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }

  //===== ACCEPT SR =====//
  Accept(Id) {
    if (confirm("Are you sure !") == true) {
      const formData = new FormData();

      formData.append("SR_Id", Id);
      formData.append("User_Id", this.api.GetUserData("Code"));
      formData.append("Source", "CRM");

      this.api.IsLoading();
      this.api.HttpPostTypeBms("../v2/sr/Submit/Accept_SR", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.SrPopup(0, Id);
            this.Reload();
          } else {
            this.api.Toast("Error", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast("Warning", "Network Error, Please try again ! ");
        }
      );
    }
  }

  ApproveByAccounts(Id) {
    if (confirm("Are you sure !") == true) {
      const formData = new FormData();

      formData.append("SR_Id", Id);
      formData.append("Type", "Approve");
      formData.append("Remark", "");
      formData.append("User_Id", this.api.GetUserData("Code"));
      formData.append("Source", "CRM");

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms("../v2/sr/Submit/AcctionByAccounts", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.api.Toast("Success", result["Message"]);

              this.Reload();
            } else {
              this.api.Toast("Error", result["Message"]);
            }
          },
          (err) => {
            this.api.Toast("Warning", "Network Error, Please try again ! ");
          }
        );
    }
  }

  RejectByAccounts(Id) {
    var remark = "";
    remark = this.promptfn("Please Enter Reject Remark");

    if (remark != "") {
      const formData = new FormData();

      formData.append("SR_Id", Id);
      formData.append("Type", "Reject");
      formData.append("Remark", remark);
      formData.append("User_Id", this.api.GetUserData("Code"));
      formData.append("Source", "CRM");

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms("../v2/sr/Submit/AcctionByAccounts", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.api.Toast("Success", result["Message"]);

              this.Reload();
            } else {
              this.api.Toast("Error", result["Message"]);
            }
          },
          (err) => {
            this.api.Toast("Warning", "Network Error, Please try again ! ");
          }
        );
    }
  }

  //===== CANCEL SR =====//
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
      formData.append("User_Id", this.api.GetUserData("Code"));
      formData.append("SR_Id", Id);
      formData.append("Remark", remark);
      formData.append("Source", "CRM");

      this.api.HttpPostTypeBms("../v2/sr/Submit/Cancel_SR", formData).then(
        (result) => {
          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.Reload();
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
  }

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
            //var baseurl = 'http://localhost:2100/';
            // var baseurl = 'https://uat.policyonweb.com/';
            var baseurl = "https://crm.squareinsurance.in/";
            var url =
              baseurl +
              "business-login/form/" +
              this.urlSegment +
              "/" +
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



  	  
  Rejected(SR_Id) {
					   
    const dialogRef = this.dialog.open(SrRejectedComponent, {
    width: "40%",
    data: { SR_Id: SR_Id },


  });

}
  // //===== REJECT SR =====//
  // Reject(Id) {
  //   var remark = "";
  //   remark = this.promptfn("Please Enter Reject Remark");

  //   if (remark != "") {
  //     if (
  //       remark == "ok" ||
  //       remark == "OK" ||
  //       remark == "okay" ||
  //       remark == "OKAY"
  //     ) {
  //       alert("Please enter vaild Reason/Remark.");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("User_Id", this.api.GetUserData("Code"));
  //     formData.append("SR_Id", Id);
  //     formData.append("Remark", remark);
  //     formData.append("Source", "CRM");

  //     this.api.HttpPostTypeBms("../v2/sr/Submit/Reject_SR", formData).then(
  //       (result) => {
  //         if (result["Status"] == true) {
  //           this.api.Toast("Success", result["Message"]);
  //           this.Reload();
  //         } else {
  //           this.api.Toast("Error", result["Message"]);
  //         }
  //       },
  //       (err) => {
  //         this.api.Toast(
  //           "Warning",
  //           "Network Error, Please try again! " + err.message
  //         );
  //       }
  //     );
  //   }
  // }

  //===== CHECK UNCHECK ROWS =====//
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
        this.checkedList.push({ Id: this.dataAr[i].Id });
      }
    }

    this.checkedList = this.checkedList;
  }

  //===== CANCEL TRANSFER =====//
  CancelTransfer() {
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

      formData.append("User_Id", this.api.GetUserData("Code"));
      formData.append("Source", "CRM");
      formData.append("Type", this.Status);
      formData.append("Assign_User", this.Assign_User);
      formData.append("Remark", this.Remark);
      formData.append("Source", "CRM");
      formData.append("is_accounts", this.is_accounts);
      formData.append("is_raise_request_view", this.is_raise_request_view);
      formData.append("checkedList", JSON.stringify(this.checkedList));
      for (var i = 0; i < this.checkedList.length; i++) {
        formData.append("SR_Ids[]", this.checkedList[i]["Id"]);
      }

      this.api.IsLoading();
      this.api.HttpPostTypeBms("../v2/sr/Submit/MultipleAction", formData).then(
        (result) => {
          this.api.HideLoading();

          alert(result["Message"]);

          if (result["Status"] == true) {
            this.Status = "";
            this.Assign_User = "";
            this.Remark = "";
            this.masterSelected = false;
            this.checkedList = [];
            this.Reload();
          } else {
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast("Warning", err.message);
        }
      );
    } else {
      //this.Reload();
      //this.masterSelected = false;
      //this.checkedList = [];
    }
  }

  //===== UPDATE SR STATUS MODAL =====//
  UpdateSrStatus(row_Id: any, Lob_Name: any): void {
    const dialogRef = this.dialog.open(SrStatusActionComponent, {
      width: "35%",
      height: "65%",
      data: { Id: row_Id, Lob_Name: Lob_Name },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  //===== CANCEL SR STATUS MODAL =====//
  CancelSrStatus(row_Id): void {
    const dialogRef = this.dialog.open(SrCancelActionComponent, {
      width: "35%",
      height: "60%",
      data: { Id: row_Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  ExportExcel(): void {
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
  }
}
