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

class ColumnsObj {
  Id: string;
  LOB: string;
  ProductName: string;
  Quotation_Id: string;
  CustomerName: string;
  ExpiryStatus: string;
  CustomerMobile: string;
  MakeModelName: string;
  Vehicle_No: string;
  Download_Url: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterData: any[];
}

@Component({
  selector: "app-renewal",
  templateUrl: "./renewal.component.html",
  styleUrls: ["./renewal.component.css"],
})
export class RenewalComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  ActivePage: string = "Default";
  buttonDisable = false;

  isSubmitted = false;

  Is_Export: any = 0;
  totalRecordsfiltered: number;
  FilterDatatype: any[];
  currentUrl: string;
  data_Ar: any = [];

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.SearchForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.Get();
    this.currentUrl = this.router.url;
    this.FilterData();
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "Table1") {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
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
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/b-crm/Reports/fetchRenewalReportsData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            this.buttonDisable = false;

            that.dataAr = resp.data;
            that.totalRecordsfiltered = resp.recordsFiltered;
            that.FilterDatatype = resp.FilterData;

            this.api.HideLoading();

            if (that.dataAr.length > 0) {
              //that.Is_Export = 1;
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

  FilterData() {
    this.api.IsLoading();
    //this.api.HttpGetType('Claim/FilterData?Page=ClaimAssistant&User_Id='+this.api.GetUserData('Id')+'&User_Type='+this.api.GetUserType()).then((result:any) => {
    this.api
      .HttpGetType(
        "b-crm/Reports/index?Page=ClaimAssistant&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            // console.log(result);
            this.data_Ar = result["Data"];
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

  ChangeStatus(Type: any) {
    this.SearchForm.get("Tab_Type").setValue(Type);
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
  GetUrl(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
}
