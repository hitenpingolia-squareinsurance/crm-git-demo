
import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
const now = new Date();

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

class ColumnsObj {
  SrNo: string;
  Id: string;
  LOB: string;
  Quotation_Id: string;
  Company: string;
  QuoteDetails: string;
  CreateDate: string;
  Vehicle_No: string;
  ProductName: string;
  Action: string;
  // Policy_No: string;
  // CustomerName: string;
  // CustomerMobile: string;
  // Download_Url: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-motor-reports',
  templateUrl: './motor-reports.component.html',
  styleUrls: ['./motor-reports.component.css'],

  styles: ["../../styles1.css"],
})

export class MotorReportsComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false }) datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  buttonDisable = false;
  isSubmitted = false;

  ProductType: any = [];
  PolicyFileType: any = [];
  Company: any = [];

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";
  ItemLOBSelection: any = [];

  QidSr: any;
  $Text = "";
  minDate = new Date();
  maxDate = new Date();
  totalCount: number;
  currentUrl: string;

  constructor(public api: ApiService, private http: HttpClient, private router: Router, private fb: FormBuilder, private activatedRoute: ActivatedRoute) {

    this.SearchForm = this.fb.group({
      Lob: [""],
      Type: [""],
      DateOrDateRange: [""],
      BusniessType: [""],
      PolicyType: [""],
      Product_Type: [""],
      Company: [""],
      SearchValue: [""],
    });

    this.minDate.setDate(this.minDate.getDate() - 30);
  }

  ngOnInit(): void {
    this.Get();
    this.currentUrl = this.router.url;

  }


  QuoteToWeb(Url) {

    var UserDatas = this.api.GetUserData('Id');
    var GetUserType = this.api.GetUserType();

    let a = document.createElement('a');
    a.target = '_blank';
    if (GetUserType == 'employee') {


      a.href =
      this.api.ReturnWebUrl() +
      "/redirecting-session-users/"+GetUserType+"/" +
      btoa(UserDatas) +
      "?ReturnUrl=" +
      Url;



      // a.href = this.api.ReturnWebUrl() + '/Prequotes/SetSessionEmployee/login/' + btoa(UserDatas) + '?ReturnUrl=' + Url;
    }
    else {


      if(GetUserType == 'user'){
        GetUserType = 'agent';
      }

      a.href =
      this.api.ReturnWebUrl() +
      "/redirecting-session-users/"+GetUserType+"/" +
      btoa(UserDatas) +
      "?ReturnUrl=" +
      Url;

      // a.href = this.api.ReturnWebUrl() + '/agents/check/' + btoa(UserDatas) + '/' + btoa(GetUserType) + '/login?ReturnUrl=' + Url;

    }
    a.click();
  }

  // QuoteToWeb(Url) {

  //   var UserDatas = this.api.GetUserData('Id');
  //   var GetUserType = this.api.GetUserType();

  //   let a = document.createElement('a');
  //   a.target = '_blank';
  //   if (GetUserType == 'employee') {

  //     a.href = Url;
  //   }
  //   else {

  //     a.href = Url;

  //   }
  //   a.click();
  // }


  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
  }


  Reload() {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.draw();
    // });
  }
  ResetDT() {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.search('').column(0).search('').draw();
    // });
  }


  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "Table1") {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
      }
    });
  }


  //===== GET DATATABLE DATA =====//
  Get() {
    

    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
 dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(this.api.additionParmsEnc(environment.apiUrl + "/helpdesk/MotorPolicyFetch?User_Id=" + this.api.GetUserData("Id") +
          "&User_Type=" + this.api.GetUserType() + '&url=' + this.currentUrl + "&Action=" + this.ActionType), dataTablesParameters, this.api.getHeader(environment.apiUrl)).subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
            this.buttonDisable = false;
            that.dataAr = resp.data;
            that.totalCount = resp.recordsFiltered;
            if (that.dataAr.length > 0) { }
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }


}
