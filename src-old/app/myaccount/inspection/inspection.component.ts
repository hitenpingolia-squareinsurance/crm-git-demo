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
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { InspectiondetailsdailogComponent } from "../../modals/inspectiondetailsdailog/inspectiondetailsdailog.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  LOB: string;
  Quotation_Id: string;
  Registration_Year: string;
  QuoteDetails: string;
  CreateDate: string;
  Vehicle_No: string;
  ProductName: string;
  case_id: string;
  status: string;
  company: string;
  InspectionNumber: string;
  // Policy_No: string;
  CustomerName: string;
  CustomerMobile: string;
  last_update_date: string;
  // Download_Url: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalCounts: any[];
}

@Component({
  selector: "app-inspection",
  templateUrl: "./inspection.component.html",
  styleUrls: ["./inspection.component.css"],
})
export class InspectionComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  ActivePage: string = "Default";
  SR_Session_Year: any = [];

  SearchForm: FormGroup;
  buttonDisable = false;
  isSubmitted = false;

  Company: any = [];
  GlobelLOB: any = [];
  ProductType: any = [];
  PolicyType: any = [];

  dropdownSettingsMultiselect: any = {};
  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";

  QidSr: any;
  InspectionFilterAr: any;
  TotalInspection: any;
  dropdownSettingsSingleselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  financialYearVal: { Id: string; Name: string }[];
  currentUrl: string;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.SearchForm = this.fb.group({
      DateOrDateRange: [""],
      ProductType: [""],
      PolicyType: [""],
      Company: [""],
      SearchValue: [""],
      InspectionFilter: [""],
      FinancialYear: [""],
    });

    // this.financialYearVal = [{ Id: "BETWEEN '2021-04-01' AND '2022-03-31'", Name: "2021-22" }];
  }

  ngOnInit(): void {
    this.Get();
    this.FilterInspection();
    this.currentUrl = this.router.url;
  }

  FilterInspection() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Globel/InspectionFilterType?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.ProductType = result["ProductType"];
            this.PolicyType = result["PolicyType"];
            this.Company = result["Company"];
            this.InspectionFilterAr = result["InspectionFilter"];
            this.SR_Session_Year = result["SR_Session_Year"];
          } else {
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

  ClearSearch() {
    // this.buttonDisable = true;
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
    this.financialYearVal = [
      { Id: "BETWEEN '2021-04-01' AND '2022-03-31'", Name: "2021-22" },
    ];
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
        dtInstance.column(0).search(JSON.stringify(event)).draw();
      }
    });
  }

  //===== GET DATATABLE DATA =====//
  Get() {
    // alert('dsdsf');
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.api.GetToken(),
      }),
    };

    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      // dom: "ilpftripl",
      // columnDefs: [{ width: "5%", targets: 6 }],
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            environment.apiUrl +
              "/myaccount/InspectionDataFetch?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&url=" +
              this.currentUrl +
              "&Action=" +
              this.ActionType,
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            that.dataAr = resp.data;
            that.TotalInspection = resp.TotalCounts;
            this.buttonDisable = false;

            // if (that.dataAr.length > 0) {
            //   this.buttonDisable = false;
            // }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };

    this.buttonDisable = false;
  }

  ShowTargetAmounts(id: any, company: any): void {
    const dialogRef = this.dialog.open(InspectiondetailsdailogComponent, {
      width: "95%",
      height: "90%",
      data: { Id: id, Company: company },
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      // console.log(result);
    });
  }

  QuoteToWeb(Url) {
    var UserDatas = this.api.GetUserData("Id");
    var GetUserType = this.api.GetUserType();

    let a = document.createElement("a");
    a.target = "_blank";
    if (GetUserType == "employee") {

      a.href =
      this.api.ReturnWebUrl() +
      "/redirecting-session-users/"+GetUserType+"/" +
      btoa(UserDatas) +
      "?ReturnUrl=" +
      "https://www.squareinsurance.in/proposal/" +
      btoa(Url);

      // a.href =
      //   this.api.ReturnWebUrl() +
      //   "/Prequotes/SetSessionEmployee/login/" +
      //   btoa(UserDatas) +
      //   "?ReturnUrl=" +
      //   "https://www.squareinsurance.in/review_pay/index/" +
      //   Url;
    } else {


      if(GetUserType == 'user'){
        GetUserType = 'agent';
      }




      a.href =
      this.api.ReturnWebUrl() +
      "/redirecting-session-users/"+GetUserType+"/" +
      btoa(UserDatas) +
      "?ReturnUrl=" +
      "https://www.squareinsurance.in/proposal/" +
      btoa(Url);
      
      // a.href =
      //   this.api.ReturnWebUrl() +
      //   "/agents/check/" +
      //   btoa(UserDatas) +
      //   "/" +
      //   btoa(GetUserType) +
      //   "/login?ReturnUrl=" +
      //   "https://www.squareinsurance.in/review_pay/index/" +
      //   Url;
    }
    a.click();
  }


  // QuoteToWeb(Url) {
  //   var UserDatas = this.api.GetUserData("Id");
  //   var GetUserType = this.api.GetUserType();

  //   let a = document.createElement("a");
  //   a.target = "_blank";
  //   if (GetUserType == "employee") {
  //     a.href = "https://www.squareinsurance.in/review_pay/index/" + Url;
  //   } else {
  //     a.href = "https://www.squareinsurance.in/review_pay/index/" + Url;
  //   }
  //   a.click();
  // }


}
