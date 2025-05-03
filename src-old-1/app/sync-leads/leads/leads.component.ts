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
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dropdownSettingsType: any = {};
  // dropdownSettingsMultiselect: any = {};

  dtOptions: DataTables.Settings = {};
  dataAr: any[];
  SearchForm: FormGroup;
  purchaseLeads: FormGroup;
  SR_Session_Year: any[];
  TransactionData: any[];
  currentUrl: any;
  year: any = '';
  month: any = '';
  rangeData: any;
  transactionId: any = '';
  dashboard_data: any;
;

  maxDate = new Date();
  minDate = new Date();
  financialYearVal: { Id: string; Name: string }[];
  Days_Data: { Id: string; Name: string; }[];
  MonthAr: { Id: string; Name: string; }[];
  Days_DataVal: { Id: string; Name: string; }[];
  isSubmitted = false;

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

    // this.dropdownSettingsMultiselect = {
    //   singleSelection: false,
    //   idField: "Id",
    //   textField: "Name",
    //   itemsShowLimit: 1,
    //   enableCheckAll: true,
    //   allowSearchFilter: true,

    // }

    this.currentUrl = this.Router.url.split('/')[2];
    this.transactionId = this.Router.url.split('/')[3];

    this.SearchForm = this.FormBuilder.group({
      FinancialYear: [""],
      DateOrDateRange: [""],
      SearchVal: [""],
      Transaction: [""],
      Days_Data : [""],
      Month : [""],

    });
    this.purchaseLeads = this.FormBuilder.group({
      leads : ["" , Validators.required]
    });

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

    this.MonthAr = [
      { Id: "01", Name: "January" },
      { Id: "02", Name: "February" },
      { Id: "03", Name: "March" },
      { Id: "04", Name: "April" },
      { Id: "05", Name: "May" },
      { Id: "06", Name: "June" },
      { Id: "07", Name: "July" },
      { Id: "08", Name: "August" },
      { Id: "09", Name: "September" },
      { Id: "10", Name: "October" },
      { Id: "11", Name: "November" },
      { Id: "12", Name: "December" },
    ];
  }

  ngOnInit() {

    this.commonfilterFieldsData();
    this.Get();
  
      this.All_Transactions();

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

  Get() {

    let apiUrl = '';
    if (this.currentUrl == 'leads') {
      apiUrl = '/SyncLeads/month_Leads?User_Id=' + this.api.GetUserData("Id") + '&User_Type=' +
        this.api.GetUserType()
    }
    if (this.currentUrl == 'purchased-leads') {
      apiUrl = '/SyncLeads/Transaction_Leads?User_Id=' + this.api.GetUserData("Id") + '&User_Type=' +
        this.api.GetUserType() + '&transaction=' +  this.transactionId 
    }
    if (this.currentUrl == 'user-transaction') {
      apiUrl = '/SyncLeads/All_Transaction?User_Id=' + this.api.GetUserData("Id") + '&User_Type=' +
        this.api.GetUserType()
    }
  

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

  All_Transactions() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "SyncLeads/Transactions?User_Id=" +
        this.api.GetUserData("Id") +
        "&User_Type=" +
        this.api.GetUserType() +
        "&Url=" +
        this.currentUrl 
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

  Getmonth(month , year){
    this.month = month;
    this.year = year;
    this.purchaseLeads.get('leads').setValue('');
  }

  purchase_Leads() {
    this.isSubmitted = true;
    const formdata = new FormData();
    const Fields = this.purchaseLeads.value;

    if (this.purchaseLeads.invalid) {
      return;
    }

    formdata.append("leads", Fields["leads"]);

    if(this.month != undefined && this.year != undefined){
      formdata.append("month", this.month);
      formdata.append("year", this.year);
    }else{
      formdata.append("month", '');
      formdata.append("year", '');
    }
   
    formdata.append("Login_User_Id", this.api.GetUserData("Id"));
    formdata.append("Login_User_Type", this.api.GetUserData("Type"));

    this.api.HttpPostType("SyncLeads/VahanData", formdata).then(
      (result: any) => {
        if (result["status"] == true) {
          this.api.Toast("Success", result["msg"]);
          const Closebutton = document.getElementById("CloseModel");
          Closebutton.click();
         
          this.ResetDT();
          this.purchaseLeads.get('leads').setValue('');
        } else {
          this.api.Toast("Warning", result["msg"]);
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


  RangeMster() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "SyncLeads/Range?User_Id=" +
        this.api.GetUserData("Id") +
        "&User_Type=" +
        this.api.GetUserType() +
        "&Url=" +
        this.currentUrl 
      )
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.rangeData = result.data;

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

}

