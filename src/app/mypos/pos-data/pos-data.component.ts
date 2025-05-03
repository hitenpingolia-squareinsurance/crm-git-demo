import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { DataTableDirective } from "angular-datatables";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}
@Component({
  selector: "app-pos-data",
  templateUrl: "./pos-data.component.html",
  styleUrls: ["./pos-data.component.css"],
})
export class PosDataComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[];
  isSubmitted = false;
  Lead_status: FormGroup;

  Id: any;
  AgentId: any;

  LeadStatus: any;
  Type: any;
  LoginId: any;
  UrlSegment: string;
  SearchForm: FormGroup;
  dropdownSettingsingleselect1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  QuoteTypes: { Id: string; Name: string }[];
  QuoteTypeVal: { Id: string; Name: string }[];

  constructor(
    private api: ApiService,
    private http: HttpClient,
    private fb: FormBuilder,
    private Router: Router
  ) {
    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.Lead_status = this.fb.group({
      Remark: ["", Validators.required],
    });
    this.UrlSegment = this.Router.url.split("/")[2];

    this.SearchForm = this.fb.group({
      Request_Type: [""],
      SearchValue: [""],
    });

    this.QuoteTypes = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];
    this.QuoteTypeVal = [{ Id: "Raise Request", Name: "Raise Request" }];

    //   //   //   console.log(this.UrlSegment);

    this.LoginId = this.api.GetUserData("Id");
  }

  ngOnInit() {
    this.Get();
  }

  get FC() {
    return this.Lead_status.controls;
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();

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
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        var fields = this.SearchForm.value;
        var query = {
          SearchValue: fields["SearchValue"],
          Request_Type: fields["Request_Type"],
        };

        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
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
                "/pos/Babp/getBabpRequests?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&SectionUrl=" +
                this.UrlSegment
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            //   //   //   console.log(resp);

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

  LeadData(Id: any, LeadStatus: any, Type: any, AgentId) {
    this.Id = Id;
    this.LeadStatus = LeadStatus;
    this.Type = Type;
    this.AgentId = AgentId;
  }

  AcceptRequest(Id, leadStatus) {
    this.api.IsLoading();

    const formdata = new FormData();
    formdata.append("id", Id);
    formdata.append("leadStatus", leadStatus);

    this.api.HttpPostType("/pos/Babp/AcceptBabpRequest", formdata).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          this.api.Toast("Success", result["msg"]);
          this.ResetDT();
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

  Leadstatus() {
    this.isSubmitted = true;
    this.api.IsLoading();
    const formdata = new FormData();
    const fields = this.Lead_status.value;
    formdata.append("Remark", fields["Remark"]);
    formdata.append("Id", this.Id);
    formdata.append("AgentId", this.AgentId);
    if (this.LeadStatus == "Reject") {
      formdata.append("LeadStatus", "0");
    }
    if (this.LeadStatus == "Approve") {
      formdata.append("LeadStatus", "2");
    }
    formdata.append("Type", this.Type);

    this.api.HttpPostType("/pos/Babp/ApprovalupdateBabp", formdata).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          this.Get();
          this.ResetDT();
          this.api.Toast("Success", result["msg"]);
          document.getElementById("close_pop").click();
          this.Lead_status.reset();
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
