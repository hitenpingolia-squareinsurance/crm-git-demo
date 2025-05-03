import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

class ColumnsObj {
  SrNo: string;
  Id: string;
  Title: string;
  Date: string;
  Image: string;
  Status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-invoice-discription-master",
  templateUrl: "./invoice-discription-master.component.html",
  styleUrls: ["./invoice-discription-master.component.css"],
})
export class InvoiceDiscriptionMasterComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  discriptionForm: FormGroup;

  loadAPI: Promise<any>;

  ActionType: any = "";
  // searchform: FormGroup;
  // isSubmitted = false;
  dtElements: any;
  SearchForm: FormGroup;

  isSubmitted = false;
  Is_Export: number;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.discriptionForm = fb.group({
      discription: ["", Validators.required],
      hsnnumber: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.Get();
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== SEARCH DATATABLE DATA =====//
  // SearchData(event: any) {
  //   this.Is_Export = 0;
  //   this.dataAr = [];

  //   this.datatableElement.dtInstance.then((dtInstance: any) => {
  //     var TablesNumber = `${dtInstance.table().node().id}`;

  //     if (TablesNumber == "Table1") {
  //       dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
  //     }
  //   });
  // }

  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "kt_datatable") {
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
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/reports/Invoice_Settlement/FetchDiscriptionDetails?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType()
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  get ErrorDiscription() {
    return this.discriptionForm.controls;
  }

  AddDiscription() {
    this.isSubmitted = true;

    // console.log(this.discriptionForm.controls);

    if (this.discriptionForm.invalid) {
      return;
    } else {
      const Feilds = this.discriptionForm.value;

      const formData = new FormData();

      formData.append("login_type", this.api.GetUserType());
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("discription", Feilds["discription"]);
      formData.append("hsnnumber", Feilds["hsnnumber"]);

      this.api
        .HttpPostType(
          "reports/Invoice_Settlement/DicsriptionHSNSubmit",
          formData
        )
        .then(
          (result: any) => {
            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              document.getElementById("closeDialoginvoice").click();
              this.ResetDT();
              this.discriptionForm.reset();
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
  }
}
