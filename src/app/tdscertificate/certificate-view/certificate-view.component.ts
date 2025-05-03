import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from "../../providers/api.service";
import { DataTableDirective } from "angular-datatables";
import { FormGroup, FormBuilder, Validators, FormControl, } from "@angular/forms";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
  Data: any;
}
@Component({
  selector: 'app-certificate-view',
  templateUrl: './certificate-view.component.html',
  styleUrls: ['./certificate-view.component.css']
})
export class CertificateViewComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  AddTDS: FormGroup;
  SearchForm: FormGroup;
  isSubmitted = false;
  SelectedFiles: File;
  TDSZip: File;
  dataAr: any;
  FiscalYear: { Id: string; Name: string }[];
  TdsStatus: { Id: string; Name: string }[];
  QuarterSelect: { Id: string; Name: string }[];
  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  CurrentUrl: any;
  agentTdsData: any;
  Url_Id: any;
  CurrentPage: any;


  constructor(private formBuilder: FormBuilder, private api: ApiService, private http: HttpClient, private router: Router,) {

    this.SearchForm = this.formBuilder.group({
      Quarter: [""],
      Fiscal_Year: [[{ Id: "2025-2026", Name: "2025-2026" }]],
      TdsStatus: [],
      SearchValue: [""],
    });
    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.FiscalYear = [
      { Id: "2023-2024", Name: "2023-2024" },
      { Id: "2024-2025", Name: "2024-2025" },
      { Id: "2025-2026", Name: "2025-2026" },
    ];


    this.TdsStatus = [
      { Id: "1", Name: "Active" },
      { Id: "0", Name: "Inactive" },
    ];
    
    this.QuarterSelect = [
      { Id: " Q1", Name: " Q1" },
      { Id: " Q2", Name: " Q2" },
      { Id: " Q3", Name: " Q3" },
      { Id: " Q4", Name: " Q4" },
    ];
  }

  ngOnInit() {
    this.CurrentUrl = this.router.url;

    var splitted = this.CurrentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.CurrentPage = splitted[2];
    }
    if (typeof splitted[2] != "undefined" && splitted[3] != "") {
      this.Url_Id = splitted[3];
    }
    if (this.CurrentPage == 'tds-view') {
      this.Get();
    } else {
      this.Getagenttds();
       }

  }


  // table 
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
    
    
  }
 

  //===== FILTER DATA =====//
  SearchData() {

    if (this.CurrentPage == 'agent-view') {
      this.Getagenttds();
      this.datatableElement.dtInstance.then((dtInstance: any) => {
        var TablesNumber = `${dtInstance.table().node().id}`;
        if (TablesNumber == "Table1") {
          var fields = this.SearchForm.value;
          var query = {
            Quarter: fields["Quarter"],
            Fiscal_Year: fields["Fiscal_Year"],
            Search: fields["SearchValue"],
            Status: fields["TdsStatus"],
          };

          dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
        }
      });
    } else {
      this.datatableElement.dtInstance.then((dtInstance: any) => {
        var TablesNumber = `${dtInstance.table().node().id}`;
        if (TablesNumber == "kt_datatable") {
          var fields = this.SearchForm.value;
          var query = {
            Quarter: fields["Quarter"],
            Fiscal_Year: fields["Fiscal_Year"],
            Search: fields["SearchValue"],
            Status: fields["TdsStatus"]
          };

          dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
        }
      });
    }

  }

  //===== CLEAR FILTER =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();
    // this.fetchAllEmployeeData();
    this.Reload();
    this.Getagenttds();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }


  Get() {
    // alert(this.api.GetUserData("type"));
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
            "/Tdscertificate/Viewtds?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Url_Id=" +
            this.Url_Id),

            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
            if (resp['status'] == 1) {
              that.dataAr = resp.data;
            } else {
              that.dataAr = [];
            }
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }





  Getagenttds() {
    // alert(this.api.GetUserData("type"));
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };
    const that = this;
    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters2: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
            "/Tdscertificate/agenttds?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Url_Id=" +
            this.Url_Id),

            dataTablesParameters2,
            httpOptions
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
              that.agentTdsData = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }



  // agenttds() {
  //   var fields = this.SearchForm.value;
  //   const formData = new FormData();
  //   formData.append("User_Id", this.api.GetUserData("Id"));


  //   formData.append("SearchValue", fields["SearchValue"]);

  //   if (fields["Quarter"] != '') {
  //     formData.append("Quarter", fields["Quarter"][0]['Id']);
  //   } else {
  //     formData.append("Quarter", '');
  //   }
  //   if (fields["Fiscal_Year"] != '') {
  //     formData.append("Fiscal_Year", fields["Fiscal_Year"][0]['Id']);
  //   } else {
  //     formData.append("Fiscal_Year", '');
  //   }

  //   this.api.HttpPostType('Tdscertificate/agenttds', formData).then(
  //     (result) => {
  //       this.api.HideLoading();
  //       if (result["status"] == true) {
  //         this.agentTdsData = result["data"];
  //       } else {
  //         this.api.Toast("Warning", result["message"]);
  //       }
  //     },
  //     (err) => {
  //       this.api.HideLoading();
  //       const newLocal = "Warning";
  //       this.api.Toast(
  //         newLocal,
  //         "Network Error : " + err.name + "(" + err.statusText + ")"
  //       );
  //     }
  //   );

  // }


}// end








