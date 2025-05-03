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
  Quotation: string;
  Mid: string;
  Company: string;
  Timestamp: string;
  StatusSrScedule: any;
}
class ColumnsObj2 {
  SrNo: string;
  Id: string;
  Quotation: string;
  policy_no: string;
  Lob: string;
  Company: string;
  Vehicle_No: string;
  Sr_status: string;
  StatusSrScedule: any;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: "app-sr-policy-reports",
  templateUrl: "./sr-policy-reports.component.html",
  styleUrls: ["./sr-policy-reports.component.css"],
})
export class SrPolicyReportsComponent implements OnInit {
  // @ViewChild(DataTableDirective, {static: false})datatableElement: DataTableDirective;

  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};

  dataAr: ColumnsObj[];
  dataAr2: ColumnsObj2[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  SearchForm2: FormGroup;

  isSubmitted = false;

  SrStatus_Ar: any = [];
  FinancialYear: any = [];
  CompanySRPolicy: any = [];
  Globel_company: any = [];

  dropdownSettingsSr: any = {};
  dropdownSettingscompany: any = {};
  dropdownSettingsCompanySRPolicy: any = {};
  dropdownSettingsFinancialYear: any = {};

  Is_Export: any = 0;

  UserTypesView: string;

  ActionType: any = "";

  ActionType2: any = "";
  QidSr: any;
  SingleSrLogData: any;
  ScedulesTextCondiotn: any;
  RamarkSr: any = "";
  RemarkValidtion: boolean;
  StatusChangeValue: any;
  DisabledUpdateHoldSr: boolean = false;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.SearchForm = this.fb.group({
      Company: [""],
    });
    this.SearchForm2 = this.fb.group({
      Sr_Status: [""],
      Company: [""],
      SearchValue: [""],
      Financial_Year: [""],
    });

    this.dropdownSettingsSr = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.dropdownSettingsCompanySRPolicy = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.dropdownSettingscompany = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.dropdownSettingsFinancialYear = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit(): void {
    this.Get();
    this.FilterDatasr();
    this.FilterDatacompany();
    this.FilterDataFinancialYear();
  }

  displayToConsole(): void {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        // // console.log(`The DataTable ${index} instance ID is: ${dtInstance.table().node().id}`);

        var TablesNumber = `${dtInstance.table().node().id}`;

        if (TablesNumber == "Table2") {
          var fields2 = this.SearchForm2.value;

          fields2["Sr_Status"] = 2;

          var query = {
            User_Id: this.api.GetUserData("Id"),
            User_Type: this.api.GetUserType(),
            Sr_Status: fields2["Sr_Status"],
            Company: fields2["Company"],
            Financial_Year: fields2["Financial_Year"],
          };
          // console.log(query);

          dtInstance
            .column(0)
            .search(this.api.encryptText(JSON.stringify(query)))
            .draw();
        }
      });
    });
  }

  ClearSearch2() {
    var fields = this.SearchForm2.reset();
    // this.dataAr2 = [];

    this.Is_Export = 0;
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.dataAr = [];

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

  SearchBtn1() {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        // // console.log(`The DataTable ${index} instance ID is: ${dtInstance.table().node().id}`);

        var TablesNumber = `${dtInstance.table().node().id}`;

        if (TablesNumber == "Table1") {
          var fields1 = this.SearchForm.value;

          var query = {
            User_Id: this.api.GetUserData("Id"),
            User_Type: this.api.GetUserType(),
            Company: fields1["Company"],
          };
          // console.log(query);

          dtInstance
            .column(0)
            .search(this.api.encryptText(JSON.stringify(query)))
            .draw();
        }
      });
    });
  }

  SearchBtn2() {
    this.api.IsLoading();

    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        var TablesNumber = `${dtInstance.table().node().id}`;

        if (TablesNumber == "Table2") {
          var fields2 = this.SearchForm2.value;
          var query = {
            User_Id: this.api.GetUserData("Id"),
            User_Type: this.api.GetUserType(),
            Sr_Status: fields2["Sr_Status"],
            Company: fields2["Company"],
            SearchValue: fields2["SearchValue"],
            Financial_Year: fields2["Financial_Year"],
          };
          // console.log(query);

          dtInstance
            .column(0)
            .search(this.api.encryptText(JSON.stringify(query)))
            .draw();
        }
      });
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
                "/mapping/RoleFetchCronData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            // console.log(that.dataAr);
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

    this.dtOptions2 = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters2: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/mapping/RoleFetchSrData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters2,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            // console.log(resp);
            this.api.HideLoading();
            that.dataAr2 = resp.data;
            if (that.dataAr2.length > 0) {
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

  FilterDatasrOld() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Mapping/FilterDataSr?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            //this.api.Toast('Success',result['msg']);
            // this.Company_Ar = result['Company_Ar'];
            // this.PolicyType_Ar = result['PolicyType_Ar'];
            //  this.TicketType_Ar = result['TicketType_Ar'];
            this.SrStatus_Ar = result["SrStatus_Ar"];
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

  FilterDatacompany() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Mapping/FilterDatacompany?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Globel_company = result["Globel_company"];
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
  FilterDataFinancialYear() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Mapping/FinancialYear?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.FinancialYear = result["Year"];

            this.SearchForm2.get("Financial_Year").setValue([
              { Id: this.FinancialYear[0].Id, Name: this.FinancialYear[0].Id },
            ]);
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

  onItemSelect(item: any, type) {}
  onItemDeSelect(item: any, type) {}

  HitSchedulePolicy(Qid: any): void {
    var Ids = this.api.GetUserData("Id");
    var Roles = this.api.GetUserType();

    this.api.IsLoading();
    this.api
      .HttpGetType("mapping/HitScedulePolicy/" + Qid + "/" + Ids + "/" + Roles)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            alert(result["data"]);
            this.SearchBtn1();
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

  ShowSrDetailsSingle(Qid, ScedulesText): void {
    this.QidSr = Qid;
    var Ids = this.api.GetUserData("Id");
    var Roles = this.api.GetUserType();

    this.ScedulesTextCondiotn = ScedulesText;

    this.api.IsLoading();
    this.api
      .HttpGetType("mapping/SingleSrLog/" + Qid + "/" + Ids + "/" + Roles)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            document.getElementById("QuoteIdBtn").click();

            this.SingleSrLogData = result["data"];
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

  FilterDatasr(): void {
    var Ids = this.api.GetUserData("Id");
    var Roles = this.api.GetUserType();

    this.api.IsLoading();
    this.api.HttpGetType("mapping/GetAllSrStatus").then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.SrStatus_Ar = result["data"];
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

  ForceHitSr(QidSr: any) {
    var confirms = confirm("Are You Sure To Hot Force Hit..!");

    if (confirms == true) {
      var Ids = QidSr;
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "SrDetails/HitSrForce/" +
            QidSr +
            "?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType()
        )
        .then(
          (result) => {
            this.api.HideLoading();

            document.getElementById("ClosePopups").click();
            this.SearchBtn2();

            if (result["Status"] == true) {
              this.api.Toast("Success", result["Message"]);

              // this.ShowSrDetailsSingle(QidSr);
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

  ChangeStatuSRPolicy(e: any, Qid: any) {
    this.QidSr = Qid;
    var Values = e.target.value;

    this.StatusChangeValue = Values;
    if (Values == "") {
    } else {
      document.getElementById("HoldPopusBtns").click();
    }
  }

  UpdateForms() {
    var RamarkSrs = this.RamarkSr;
    if (RamarkSrs == "") {
      this.RemarkValidtion = true;
      return false;
    } else {
      this.RemarkValidtion = false;
    }

    var confirms = confirm("Are You Sure To pdate Status..!");

    if (confirms == true) {
      var Ids = this.QidSr;

      var StatusChangeValue = this.StatusChangeValue;

      this.DisabledUpdateHoldSr = true;
      this.api.IsLoading();
      var RamarkSrs = this.RamarkSr;
      this.api
        .HttpGetType(
          "SrDetails/UpdateSrStatus/" +
            Ids +
            "/" +
            StatusChangeValue +
            "?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Remark=" +
            RamarkSrs
        )
        .then(
          (result) => {
            this.api.HideLoading();

            document.getElementById("ClosePopupsHolds").click();
            this.SearchBtn2();
            this.DisabledUpdateHoldSr = false;

            if (result["Status"] == true) {
              this.api.Toast("Success", result["Message"]);

              this.RamarkSr = "";
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
}
