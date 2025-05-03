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
import { ViewEndorsementDetailsComponent } from "../../modals/view-endorsement-details/view-endorsement-details.component";
import { ActionUnknownWindowComponent } from "../action-unknown-window/action-unknown-window.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  LOB: string;
  TypeName: string;
  Quotation_Id: string;
  Company: string;
  PolicyNo: string;
  CustomerName: string;
  CustomerMobile: string;
  DownloadUrl: string;
  Vehicle_No: string;
  Policy_Type: string;
  BookingDate: string;
  NetPremium: string;
  IssuedDate: string;
  GrossPremium: string;
  TotalFiles: string;
  TotalPremium: string;

  RM_Name: string;
  Agent_Name: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
  FilterToTalPolicyAndPremium: any;
  FilterArray: any;
}
@Component({
  selector: "app-fetch-unknown-files",
  templateUrl: "./fetch-unknown-files.component.html",
  styleUrls: ["./fetch-unknown-files.component.css"],
})
export class FetchUnknownFilesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  SendmailForm: FormGroup;
  isSubmitted = false;
  buttonDisable = false;

  Ins_Compaines: any = [];
  GlobelLOB: any = [];
  PolicyFileType: any = [];
  PolicyType: any = [];
  ProductType: any = [];
  SR_Session_Year: any = [];
  SRSource_Ar: any = [];
  filterrd: any = [];

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsingleselect: any = {};

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";

  QidSr: any;

  //selected
  ItemLOBSelection: any = [];
  minDate: Date;
  maxDate: Date;
  financialYearVal: { Id: string; Name: string }[];
  currentUrl: string;
  FilterToTalPolicyAndPremium: any;

  TotalLifeSrData: number = 0;
  TotalNon_MotorSrData: number = 0;
  TotalHealthSrData: number = 0;
  TotalMotorSrData: number = 0;
  TotalLifeNetPremium: number = 0;
  TotalNon_MotorNetPremium: number = 0;
  TotalHealthNetPremium: number = 0;
  TotalMotorNetPremium: number = 0;
  TotalNetPremium: number = 0;
  TotalSR: number = 0;
  TotalTravelSrData: any;
  TotalTravelNetPremium: any;
  TotalPaSrData: any;
  TotalPaNetPremium: any;
  EmailValue: string;
  Login_Type: string | null;
  UserRoleType: string | null;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.SearchForm = this.fb.group({
      FinancialYear: ["", Validators.required],
      DateOrDateRange: [""],
      Source: [""],
      Lob: [""],
      PolicyFileType: [""],
      PolicyType: [""],
      ProductType: [""],
      Company: [""],
      SearchValue: [""],
    });
    this.UserRoleType = this.api.GetUserType();

    this.SendmailForm = this.fb.group({
      mobilex: [
        "",
        [
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      SrId: ["", Validators.required],
      emailx: [
        "",
        [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      ],
    });

    this.financialYearVal = [{ Id: "2021-22", Name: "2021-22" }];

    var Values1 = this.financialYearVal[0].Id.split("-");
    var Year1 = parseInt(Values1[0]);
    var Year2 = Year1 + 1;

    this.minDate = new Date("04-01-" + Year1);
    this.maxDate = new Date("03-31-" + Year2);

    var currentDate = new Date();
    //var CurrentYears=(new Date()).getFullYear();
    var currentDateString =
      currentDate.getDate() +
      "/" +
      (currentDate.getMonth() + 1) +
      "/" +
      currentDate.getFullYear();
    var OneMonthBefore =
      currentDate.getDate() +
      "/" +
      currentDate.getMonth() +
      "/" +
      currentDate.getFullYear();
    var currentDateString = OneMonthBefore + " - " + currentDateString;
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.Get();

    this.Login_Type = this.api.GetUserType();
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  ClearSearch() {
    this.buttonDisable = true;

    var fields = this.SearchForm.reset();
    this.ResetDT();
    this.financialYearVal = [{ Id: "2021-22", Name: "2021-22" }];
  }

  Reload() {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.draw();
    // });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
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
    this.buttonDisable = true;

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
                "/UnknownWindow/UnknowPolicyDataFetch?User_Id=" +
                2 +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&Action=" +
                this.ActionType +
                "&Pos_Type=" +
                this.api.GetUserData("pos_type")
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            this.buttonDisable = false;
            that.dataAr = resp.data;
            that.FilterData = resp.FilterPolicyData;
            that.FilterToTalPolicyAndPremium = resp.FilterToTalPolicyAndPremium;
            if (that.dataAr.length > 0) {
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
              FilterPolicyData: [],
              FilterArray: [],
            });
          });
      },
    };
  }
  ActionUnknownWindow(Id: any) {
    // alert(Id);
    const dialogRef = this.dialog.open(ActionUnknownWindowComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { Id: Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
  ViewFilterData(query) {
    this.api.IsLoading();
    this.api;

    const formData = new FormData();
    formData.append("query", query);

    this.api.IsLoading();
    this.api
      .HttpPostType(
        "myaccount/TableData?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType(),
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.FilterData = result["Data"];
          } else {
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

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  ViewEndrosmentUsingSrNo(srno: any) {
    const dialogRef = this.dialog.open(ViewEndorsementDetailsComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { Id: srno },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  get Fc() {
    return this.SendmailForm.controls;
  }

  SendMailId(Id: any) {
    this.SendmailForm.get("SrId").setValue(Id);
  }

  SendMail(SrId, Email, Type) {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("UserCode", this.api.GetUserData("Code"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("SrId", SrId);

    if (Type == "Email") {
      formData.append("Email", Email);

      formData.append("Mobile", "");
    } else if (Type == "Mobile") {
      formData.append("Email", "");

      formData.append("Mobile", Email);
    } else {
      return false;
    }

    this.api.IsLoading();
    this.api
      .HttpPostType("Email_Send/SendPolicyWhatsappAndMail", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          // alert(result);
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
          } else if (result["Status"] == 2) {
            return this.SendmailForm.controls;
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  promptfn(m) {
    var msg = prompt(m, "");
    if (msg == null) {
      return "";
    }
    if (msg == "") {
      return m;
    } else {
      return msg;
    }
  }

  SendMailPoupup(Id) {
    var email = "";
    email = this.promptfn("Please Enter Email");

    if (email != "") {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        // alert('this mail id is valid');

        this.EmailValue = email;
        this.SendMail(Id, this.EmailValue, "Email");
      } else {
        alert("You have entered an invalid email address!");
        return false;
      }
    }
  }

  WhatsappSend(Id, Mobile) {
    if (Mobile != "") {
      this.SendMail(Id, Mobile, "Mobile");
    } else {
      alert("Invalid Mobile!");
      return false;
    }
  }

  ChangeStatusRenewals(e: any, Id: number) {
    var Values = e.target.value;
    if (Values == "") this.api.Toast("Warning", "Status is mandatory..!");
    else {
      var Confirms = confirm("Are You Sure To Change Status?");
      if (Confirms == true) {
        // alert();
        // this.api
        //   .HttpGetType(
        //     "UnknownWindow/ChangeStatus?Page=User&User_Id=" +
        //     this.api.GetUserData("Id") +
        //     "&User_Type=" +
        //     this.api.GetUserType() +
        //     "&Id=" +
        //     Id +
        //     "&Status=" +
        //     Values
        //   )
        //   .then(
        //     (result) => {
        //       if (result["status"] == true) {
        //         this.api.Toast("Success", result["msg"]);
        //         setTimeout(() => {
        //           this.ResetDT();
        //         }, 500);
        //       } else {
        //         this.api.Toast("Warning", result["msg"]);
        //         // setTimeout(() => {
        //         //   this.router.navigate([result["data"]["Return"]]);
        //         // }, 1000);
        //       }
        //     },
        //     (err) => {
        //       this.api.Toast(
        //         "Warning",
        //         "Network Error : " + err.name + "(" + err.statusText + ")"
        //       );
        //     }
        //   );
      }
    }
  }
}
