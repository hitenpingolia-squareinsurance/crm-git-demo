import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dropdownSettingsType: any = {};
  dropdownSettingsMultiselect: any = {};

  dtOptions: DataTables.Settings = {};
  dataAr: any[];
  VahanData: any[];
  SearchForm: FormGroup;
  SR_Session_Year: any[];
  PurchasedData: any[];
  AllRange: any[];
  All_Leads: any[];
  User_Data: any[];
  currentUrl: any;
  planKey: any = '';

  maxDate = new Date();
  minDate = new Date();
  financialYearVal: { Id: string; Name: string }[];
  LeadId: any;
  LeadType: any;
  AllUsersData: any;
  Days_Data: { Id: string; Name: string; }[];
  Days_DataVal: { Id: string; Name: string; }[];
  transactionId: string;
  dashboard_data: any;
  TransactionData: any;
  mainOption: string;
  subOption: string;
  EmployeeSelected: any;

  hasAccess: boolean = true;
  errorMessage: string = "";


  constructor(
    private api: ApiService,
    private http: HttpClient,
    public Router: Router,
    public FormBuilder: FormBuilder,
  ) {


    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true
    };

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,

    }

    this.currentUrl = this.Router.url.split('/')[2];
    this.transactionId = this.Router.url.split('/')[3];

    this.SearchForm = this.FormBuilder.group({
      FinancialYear: [""],
      DateOrDateRange: [""],
      SearchVal: [""],
      Range: [""],
      Transaction: [""],
      UserData: [""],
      AllUsers: [""],
      Days_Data : [""],
      Purchased : [""],

    });

      if(this.currentUrl == 'synced-users'){
          this.PurchasedData = [
            { Id: "1", Name: "Synced" },
            { Id: "0", Name: "Pending" }
          ];
      }else{
        this.PurchasedData = [
          { Id: "1", Name: "Purchased" },
          { Id: "0", Name: "Non-Purchased" }
        ];
    }
 
    // this.User_Data = [
    //   { Id: "Employee", Name: "Employee" },
    //   { Id: "Agent", Name: "Agent" },
    //   { Id: "SP", Name: "SP" }
    // ];

    this.Days_Data = [
      { Id: "Today", Name: "Today" },
      { Id: "2", Name: "2 Days" },
      { Id: "7", Name: "7 Days" },
      { Id: "15", Name: "15 Days" },
      { Id: "30", Name: "30 Days" },
      { Id: "45", Name: "45 Days" },
      { Id: "Expired", Name: "Expired" },
    ]

    // this.Days_DataVal = [{ Id: "45", Name: "45 Days" }];

    // this.financialYearVal = [{ Id: "2025-26", Name: "2025-26" }];
    // var Values1 = this.financialYearVal[0].Id.split("-");
    // var Year1 = parseInt(Values1[0]);
    // var Year2 = Year1 + 1;

    // this.minDate = new Date("04-01-" + Year1);
    // this.maxDate = new Date("03-31-" + Year2);
  }

  ViewLeads(PlanKey, user, userType) {
    this.api.saveState(user, userType);

    this.Router.navigate(['/Sync/leads/' + PlanKey], {
      state: { user, userType }
    });

  }

  ngOnInit() {
    
    this.commonfilterFieldsData();
    this.Get();
    this.searchEmployee();
   
    if(this.currentUrl == 'synced-report'){
      this.Range();
    }
    if(this.currentUrl == 'synced-report' || this.currentUrl == 'synced-contact' || this.currentUrl == 'synced-leads'){
      this.Transaction();
    }
      
    
    // if(this.currentUrl == 'leads' || this.currentUrl == 'AllLeads'){
    //   this.AllLeads();
    // }

  }

  // Selected_User(e) {
  //   this.SearchForm.get('AllUsers').setValue('');
  //   this.api.IsLoading();
  //   this.api
  //     .HttpGetType(
  //       "SyncLeads/Select_User?User_Id=" +
  //       this.api.GetUserData("Id") +
  //       "&User_Type=" +
  //       this.api.GetUserType() +
  //       "&Url=" +
  //       this.currentUrl +
  //       "&UserDetail=" +
  //       e.Id
  //     )
  //     .then(
  //       (result: any) => {
  //         this.api.HideLoading();
  //         if (result["status"] == true) {
  //           this.AllUsersData = result.data;

  //         } else {
  //           this.api.Toast("Warning", result["msg"]);
  //         }
  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //         this.api.Toast(
  //           "Warning",
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //       }
  //     );

  // }

  Remove_User() {
    this.SearchForm.get('AllUsers').setValue('');
  }

  ClearSearch() {

    this.dataAr = [];
    this.SearchForm.reset();
    this.ResetDT();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  SearchData() {
    const fields = this.SearchForm.value;

    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: any) => {

      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(fields))).draw();
    });
  }


  onItemSelect(item: any) {

    var Years = item.Id;
    var Explods = Years.split("-");
    var Year1 = parseInt(Explods[0]);
    var Year2 = Year1 + 1;

    this.minDate = new Date("04-01-" + Year1);
    this.maxDate = new Date("03-31-" + Year2);

    this.SearchForm.get("DateOrDateRange").setValue("");


  }

  commonfilterFieldsData() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "b-crm/Filter/commonfilterFieldsData?User_Id=" +
        this.api.GetUserData("Id") +
        "&User_Type=" +
        this.api.GetUserType() +
        "&portal=Square&empType=" +
        this.api.GetUserData("Type") +
        "&EmpId=" +
        this.api.GetUserData("Code") +
        "&Url=" +
        this.currentUrl
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.SR_Session_Year = result["Data"]["SR_Session_Year"];

          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  Range() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "SyncLeads/Report_Data?User_Id=" +
        this.api.GetUserData("Id") +
        "&User_Type=" +
        this.api.GetUserType() +
        "&Type=" +
        'Range'
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.AllRange = result.data;

          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  Transaction() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "SyncLeads/Report_Data?User_Id=" +
        this.api.GetUserData("Id") +
        "&User_Type=" +
        this.api.GetUserType() +
        "&Type=" +
        'Transaction'
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.TransactionData = result.data;

          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }



  Get() {

    let apiUrl = '';
    if (this.currentUrl == 'synced-report') {
      apiUrl = '/SyncLeads/synced_report?User_Id=' + this.api.GetUserData("Id") + '&User_Type=' +
        this.api.GetUserType()
    }
    if (this.currentUrl == 'synced-contact') {
      apiUrl = '/SyncLeads/synced_report?User_Id=' + this.api.GetUserData("Id") + '&User_Type=' +
        this.api.GetUserType() + "&admin=" + 'contacts'
    }
    if (this.currentUrl == 'synced-users') {
      apiUrl = '/SyncLeads/synced_report?User_Id=' + this.api.GetUserData("Id") + '&User_Type=' +
        this.api.GetUserType() + "&admin=" + 'users'
    }

    if (this.currentUrl == 'synced-details') {
      apiUrl = '/SyncLeads/Transaction_Leads?User_Id=' + this.api.GetUserData("Id") + '&User_Type=' +
        this.api.GetUserType() + '&transaction=' +  this.transactionId 
    }
    if (this.currentUrl == 'synced-leads') {
      apiUrl = '/SyncLeads/Transaction_Leads?User_Id=' + this.api.GetUserData("Id") + '&User_Type=' +
        this.api.GetUserType() + '&admin=' +  'All_Leads' 
    }
   
    // if (this.currentUrl == 'users') {
    //   apiUrl = '/SyncLeads/All_Users?User_Id=' + this.api.GetUserData("Id") + '&User_Type=' +
    //     this.api.GetUserType()
    // }
    // if (this.currentUrl == 'leads') {
    //   apiUrl = '/SyncLeads/VahanData_Admin?planId=' + this.planKey + "&userId=" + this.LeadId + "&userType=" + this.LeadType + "&User_Id=" + this.api.GetUserData("Id") + "&User_Type=" +
    //     this.api.GetUserType()
    // }


    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.http.post<DataTablesResponse>(this.api.additionParmsEnc(environment.apiUrl + apiUrl), dataTablesParameters, this.api.getHeader(environment.apiUrl))
          .subscribe((res:any) => {
          var resp = JSON.parse(this.api.decryptText(res.response));
          
          if (resp.status === "urlWrong") {
            this.hasAccess = false;
            this.errorMessage = resp.msg;
            return;
          }
          this.hasAccess = true;

          this.dashboard_data = resp;
            this.dataAr = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }


  searchEmployee() {
   
    this.mainOption = "423";
    this.subOption = "Is_View";

    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("portal", "Crm");
    formData.append("mainOption", this.mainOption);
    formData.append("subOption", this.subOption);
    this.api
      .HttpPostType("b-crm/Filter/commonSearchEmployee", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.User_Data = result["data"];
        }
      });
  }


  searchAgent() {
    let IDS = this.SearchForm.value["UserData"];
    

    if (IDS != "") {
      this.EmployeeSelected = IDS.map((item) => item.Id);
      const formData = new FormData();
      formData.append("loginId", this.api.GetUserData("Id"));
      formData.append("loginType", this.api.GetUserType());
      formData.append("EmployeeId", this.EmployeeSelected);

      this.api
        .HttpPostType("SyncLeads/searchAgent", formData)
        .then((result: any) => {
          if (result["status"] == true) {
            this.AllUsersData = result["data"];
          }
        });
    }
  }


}
