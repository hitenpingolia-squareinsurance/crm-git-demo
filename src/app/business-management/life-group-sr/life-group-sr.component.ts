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

import { GroupSrMembersComponent } from "../../modals/life-sr/group-sr-members/group-sr-members.component";
import { LifeEndorsementTrackComponent } from "../../modals/life-sr/life-endorsement-track/life-endorsement-track.component";

class ColumnsObj {
  Id: string;
  isSelected: any;
  Agent_Id: any;
  Posting_Status_Web: any;
  SR_No: string;
  Full_SR_No: string;
  Add_Stamp: string;
  LI_Status: any;
  LOB_Name: string;
  Segment_Id: string;
  Product_Id: string;
  SubProduct_Id: string;
  Agent_Name: string;
  RM_Name: string;
  Proposer_Type: string;
  ShowAction: string;
  Policy_Issuance_Date: string;
  ShowEditOption: string;
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
  selector: "app-life-group-sr",
  templateUrl: "./life-group-sr.component.html",
  styleUrls: ["./life-group-sr.component.css"],
})
export class LifeGroupSrComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  UserId: number = this.api.GetUserData("Id");

  ActivePage: string = "Default";
  statusType: string = "";

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
  SrStatusValue: Array<any>;

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
    this.SearchForm = this.fb.group({
      Vertical_Id: ["0"],
      Region_Id: ["0"],
      Sub_Region_Id: ["0"],
      Emp_Id: [""],
      SRAgent_Type: [""],
      Agent_Id: [""],
      Product_Id: [""],
      Company_Id: [""],
      //SRLOB: ['', [Validators.required]],
      CurrentUser_Id: [""],
      SRStatus: [""],
      SRType: [""],
      SR_Source_Type: [""],
      GlobalSearch: [""],
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
      { Id: "LI", Name: "Life" },
    ];
    this.SRSource_Ar = [
      { Id: "BMS", Name: "Offline" },
      { Id: "CRM", Name: "Online" },
      { Id: "Excel", Name: "Excel" },
    ];
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

    //this.DisableNextMonth = new Date();

    this.minDate.setDate(this.minDate.setFullYear(2001));
    this.maxDate.setDate(this.maxDate.getDate() - this.maxDate.getDate());
  }

  ngOnInit(): void {
    this.Get();
    this.FilterData();
  }

  //===== FORM CONTROLS VALIDATION =====//
  get FC() {
    var fields = this.SearchForm.value;
    return this.SearchForm.controls;
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

  //===== ON ITEM SELECT =====//
  onItemSelect(item: any, Type: any) {
    //Type is Vertical
    if (Type == "Vertical") {
      this.Emps_Ar = [];
      this.Agents_Ar = [];

      this.ItemVerticalSelection.push(item.Id);
      // console.log(this.ItemVerticalSelection);
      //this.GetEmployees('OneByOneSelect');
    }

    //Type is Employee
    if (Type == "Employee") {
      this.Agents_Ar = [];

      this.ItemEmployeeSelection.push(item.Id);
      // console.log(this.ItemEmployeeSelection);
      this.GetAgents("OneByOneSelect");
    }

    //Type is LOB
    if (Type == "LOB") {
      this.ItemLOBSelection.push(item.Id);
      if (item.Id == "LI" && this.ItemLOBSelection.length == 1) {
        this.statusType = "Life";
      } else {
        this.statusType = "";
      }
      //this.GetProducts('OneByOneSelect');
      this.GetInsCompany("OneByOneSelect");
    }
  }

  //===== ON ITEM DeSELECT =====//
  onItemDeSelect(item: any, Type: any) {
    // // console.log('Type : '+ Type);
    // // console.log('onDeSelect', item);

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
      // console.log(this.ItemLOBSelection[0])
      if (item.Id == "LI") {
        this.statusType = "";
      } else if (
        this.ItemLOBSelection.length == 1 &&
        this.ItemLOBSelection[0] == "LI"
      ) {
        this.statusType = "Life";
      }
      //this.GetProducts('OneByOneDeSelect');
      this.GetInsCompany("OneByOneSelect");
    }
  }

  //===== GET EMPLOYEES =====//
  GetEmployees() {
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

  //===== GET INSURANCE COMPANY ACCORDING LOB =====//
  GetInsCompany(Type) {
    const formData = new FormData();
    formData.append("Type", Type);
    formData.append("LOB_Ids", JSON.stringify(this.SearchForm.value["SRLOB"]));
    this.api
      .HttpPostType("reports/BussinessReport/GetInsCompany", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.Companies_Ar = result["Data"];
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

  //===== SEARCH DATATABLE DATA =====//
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

        // LOB : fields['SRLOB'],
        Product_Id: fields["Product_Id"],
        Company_Id: fields["Company_Id"],

        //CurrentUser_Id : fields['CurrentUser_Id'],
        Source: fields["SR_Source_Type"],
        SR_Status: fields["SRStatus"],
        //Request_Type : fields['Request_Type'],
        SR_Type: fields["SRType"],
        GlobalSearch: fields["GlobalSearch"],

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

  //===== CLEAR SEARCH FORM =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.SearchForm.get("Vertical_Id").setValue("0");
    this.SearchForm.get("Region_Id").setValue("0");
    this.SearchForm.get("Sub_Region_Id").setValue("0");
    this.SearchForm.get("Request_Type").setValue("2");

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

  //===== RELOAD PAGE =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
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
      lengthMenu: [10, 25, 50, 100],
      pageLength: 10,
      //searching: false,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBms +
                "/GridData/GetLifeGroupSrData?ActivePage=" +
                this.ActivePage +
                "&User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&User_Type=" +
                this.api.GetUserType()
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

  //===== REDIRECT TO EDIT URL =====//
  EditModel(Id: any): void {
    this.router.navigateByUrl("/business-management/sr-creation/" + Id);
  }

  //===== VIEW DOCUMENTS =====//
  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  //===== SR POPUP =====//
  SrPopup(type: any, row_Id: any): void {
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
              "business-login/form/life-insurance/" +
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

  //===== VIEW GROUP SR MEMBER DETAILS =====//
  ViewGroupSrMembers(row_Id: any): void {
    const dialogRef = this.dialog.open(GroupSrMembersComponent, {
      width: "75%",
      height: "75%",
      data: { Id: row_Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  //===== VIEW ENDORSEMENT LOG DETAILS =====//
  ViewEndorsementLog(row_Id: any): void {
    const dialogRef = this.dialog.open(LifeEndorsementTrackComponent, {
      width: "55%",
      height: "75%",
      data: { Id: row_Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
