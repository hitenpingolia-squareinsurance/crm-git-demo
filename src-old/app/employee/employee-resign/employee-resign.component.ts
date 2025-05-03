import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { DataTableDirective } from "angular-datatables";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}
@Component({
  selector: "app-employee-resign",
  templateUrl: "./employee-resign.component.html",
  styleUrls: ["./employee-resign.component.css"],
})
export class EmployeeResignComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[];
  url: any;
  employee_resign: FormGroup;
  Id: any;
  LeadStatus: any;

  isSubmitted = false;
  ActionStatus: any;
  currentDate: any;
  dataArra: unknown;
  SearchForm: FormGroup;
  QuoteTypes: { Id: string; Name: string }[];
  QuoteTypeVal: { Id: string; Name: string }[];

  dropdownSettingsingleselect1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  loginId: any;
  constructor(
    private api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.loginId = this.api.GetUserData("Id");
    const today = new Date();

    this.currentDate = today.toISOString().slice(0, 10); // 'YYYY-MM-DD'

    console.log(today.toISOString().slice(0, 10));

    this.employee_resign = this.fb.group({
      Remark: ["", Validators.required],
      resignationDate: [""],
      noc_status: [""],
    });

    this.SearchForm = this.fb.group({
      Request_Type: [""],
      SearchValue: [""],
    });

    this.QuoteTypes = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];
    this.QuoteTypeVal = [{ Id: "Raise Request", Name: "Raise Request" }];

    this.url = this.router.url.split("/")[2];
  }

  ngOnInit() {
    this.Get();
  }
  get FC() {
    return this.employee_resign.controls;
  }

  AcceptRequest(Id, leadStatus) {
    this.api.IsLoading();

    const formdata = new FormData();
    formdata.append("id", Id);
    formdata.append("leadStatus", leadStatus);

    this.api
      .HttpPostType("Employeeresign/AcceptResignationRequest", formdata)
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
          } else {
            this.api.Toast("Warning", result["msg"]);
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

  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        var fields = this.SearchForm.value;
        var query = {
          SearchValue: fields["SearchValue"],
          Request_Type: fields["Request_Type"],
        };

        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
      }
    });
  }

  //===== CLEAR FILTER =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.ResetDT();
  }

  ViewResignationDetails(id) {
    this.api.IsLoading();
    this.api.HttpGetType("Employeeresign/ViewPospResignDetails?id=" + id).then(
      (result) => {
        this.api.HideLoading();
        // alert();
        this.dataArra = result;
      },
      (err) => {
        this.api.HideLoading();
        this.dataArra = err["error"]["text"];
        // console.log( this.dataArr);
      }
    );
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
            this.api.additionParmsEnc(environment.apiUrl +
              "/Employeeresign/getEmployeeResignationData?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&SectionUrl=" +
              this.url),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            if (that.dataAr.length > 0) {
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

  LeadData(Id: any, ActionStatus: any, LeadStatus: any) {
    this.Id = Id;
    this.ActionStatus = ActionStatus;
    this.LeadStatus = LeadStatus;

    this.employee_resign.get("resignationDate").setValidators(null);
    this.employee_resign.get("noc_status").setValidators(null);

    if (this.LeadStatus == 3 && this.ActionStatus == "Approve") {
      this.employee_resign
        .get("resignationDate")
        .setValidators([Validators.required]);
      this.employee_resign
        .get("noc_status")
        .setValidators([Validators.required]);
    }

    this.employee_resign.get("resignationDate").updateValueAndValidity();
    this.employee_resign.get("noc_status").updateValueAndValidity();

    if (LeadStatus == 3 && ActionStatus == "Approve") {
      this.GetNoticePeriod();
    }
  }

  GetNoticePeriod() {
    const today = new Date();
    const daysToAdd = Math.floor(Math.random() * 60); // Random number between 45 and 60
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysToAdd);

    // Set the value in your form control with the formatted date
    this.employee_resign
      .get("resignationDate")
      .setValue(futureDate.toISOString().slice(0, 10)); // 'YYYY-MM-DD' format

    console.log(futureDate.toISOString().slice(0, 10)); // Log the date in 'YYYY-MM-DD' format
  }

  EmployeeResign() {
    this.isSubmitted = true;
    this.api.IsLoading();
    if (this.employee_resign.invalid) {
      this.api.HideLoading();
      return;
    }
    const formdata = new FormData();
    const fields = this.employee_resign.value;
    formdata.append("remark", fields["Remark"]);
    formdata.append("resignationDate", fields["resignationDate"]);
    formdata.append("noc_status", fields["noc_status"]);
    formdata.append("id", this.Id);

    if (this.ActionStatus == "Reject") {
      formdata.append("status", "0");
    }
    if (this.ActionStatus == "Approve") {
      formdata.append("status", "1");
    }

    this.api
      .HttpPostType("Employeeresign/ApprovalupdateResignation", formdata)
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.isSubmitted = false;
            this.Get();
            this.ResetDT();
            this.api.Toast("Success", result["msg"]);
            document.getElementById("close_pop").click();
            this.employee_resign.reset();
          } else {
            this.api.Toast("Warning", result["msg"]);
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
