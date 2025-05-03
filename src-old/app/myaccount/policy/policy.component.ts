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
  CurrentDate: any;
}
@Component({
  selector: "app-policy",
  templateUrl: "./policy.component.html",
  styleUrls: ["./policy.component.css"],
})
export class PolicyComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  SendmailForm: FormGroup;
  AddCatForm: FormGroup;

  isSubmitted1 = false;
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
  TotalTravelSrData: number = 0;
  TotalTravelNetPremium: number = 0;
  TotalPaSrData: number = 0;
  TotalPaNetPremium: number = 0;
  EmailValue: string;
  Login_Type: string | null;
  TotalGems: number = 0;
  TotalMotorGems: number = 0;
  TotalHealthGems: number = 0;
  TotalNon_MotorGems: number = 0;
  TotalLifeGems: number = 0;
  TotalTravelGems: number = 0;
  TotalPaGems: number = 0;
  TotalGemsPaid: number = 0;
  FetchCurrentDate: any;
  ClaimTypeData: { Id: string; Name: string }[];
  ClaimRaiseSrId: any = "";
  Partner: any;
  TotalMotorPayin: number = 0;
  TotalMotorPO: number = 0;
  TotalHealthPO: number = 0;
  TotalNon_MotorPO: number = 0;
  TotalLifePO: number = 0;
  TotalTravelPO: number = 0;
  TotalPaPO: number = 0;
  TotalHealthPayin: number = 0;
  TotalNon_MotorPayin: number = 0;
  TotalLifePayin: number = 0;
  TotalTravelPayin: number = 0;
  TotalPaPayin: number = 0;
  TotalPO: number = 0;
  TotalPayin: number = 0;
  TotalPosted: number = 0;
  TotalPaid: number = 0;
  TotalUn_Paid: number = 0;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.ClaimTypeData = [
      {
        Id: "Category",
        Name: "Category",
      },

      {
        Id: "SubCategory",
        Name: "SubCategory",
      },
    ];

    this.AddCatForm = this.fb.group({
      ClaimType: ["", Validators.required],
      DriverName: [""],
      Mobile: [
        "",

        [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
    });

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
    this.Partner = this.api.GetUserData("Partner");

    this.currentUrl = this.router.url;
    this.Get();

    this.Login_Type = this.api.GetUserType();
    //   //   //   console.log(this.Login_Type);
  }

  get formControls() {
    return this.SearchForm.controls;
  }
  get formControls2() {
    return this.AddCatForm.controls;
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
                "/myaccount/PolicyDataFetch?User_Id=" +
                this.api.GetUserData("Id") +
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
            if (resp["Excel_Url"] != "") {
              window.open(resp["Excel_Url"]);
              this.api.Toast("Success", resp["msg"]);
            }

            this.buttonDisable = false;
            that.dataAr = resp.data;
            that.FilterData = resp.FilterPolicyData;
            that.FilterToTalPolicyAndPremium = resp.FilterToTalPolicyAndPremium;
            that.FetchCurrentDate = resp.CurrentDate;
            that.CalculateTotalDataLobWise(resp.FilterArray);
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

  CalculateTotalDataLobWise(Query: any) {
    const that = this;

    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Query", Query);

    // this.api.IsLoading();
    this.api.HttpPostType("myaccount/TotalDataLob", formData).then(
      (result: any) => {
        // this.api.HideLoading();
        // alert();
        if (result["Status"] == true) {
          that.TotalSR = result["Data"].TotalSR;
          that.TotalNetPremium = result["Data"].TotalNetPremium;
          that.TotalMotorNetPremium = result["Data"].TotalMotorNetPremium;
          that.TotalHealthNetPremium = result["Data"].TotalHealthNetPremium;
          that.TotalNon_MotorNetPremium =
            result["Data"].TotalNon_MotorNetPremium;
          that.TotalLifeNetPremium = result["Data"].TotalLifeNetPremium;
          that.TotalMotorSrData = result["Data"].TotalMotorSrData;
          that.TotalHealthSrData = result["Data"].TotalHealthSrData;
          that.TotalNon_MotorSrData = result["Data"].TotalNon_MotorSrData;
          that.TotalLifeSrData = result["Data"].TotalLifeSrData;
          that.TotalTravelSrData = result["Data"].TotalTravelSrData;
          that.TotalTravelNetPremium = result["Data"].TotalTravelNetPremium;
          that.TotalPaSrData = result["Data"].TotalPaSrData;
          that.TotalPaNetPremium = result["Data"].TotalPaNetPremium;
          that.TotalGems = result["Data"].TotalGems;
          that.TotalMotorGems = result["Data"].TotalMotorGems;
          that.TotalHealthGems = result["Data"].TotalHealthGems;
          that.TotalNon_MotorGems = result["Data"].TotalNon_MotorGems;
          that.TotalLifeGems = result["Data"].TotalLifeGems;
          that.TotalTravelGems = result["Data"].TotalTravelGems;
          that.TotalPaGems = result["Data"].TotalPaGems;
          that.TotalGemsPaid = result["Data"].TotalGemsPaid;

          that.TotalMotorPO = result["Data"].TotalMotorPO;
          that.TotalHealthPO = result["Data"].TotalHealthPO;
          that.TotalNon_MotorPO = result["Data"].TotalNon_MotorPO;
          that.TotalLifePO = result["Data"].TotalLifePO;
          that.TotalTravelPO = result["Data"].TotalTravelPO;
          that.TotalPaPO = result["Data"].TotalPaPO;
          that.TotalPosted = result["Data"].TotalPosted;
          that.TotalPaid = result["Data"].TotalPaid;
          that.TotalUn_Paid = result["Data"].TotalUn_Paid;
          that.TotalMotorPayin = result["Data"].TotalMotorPayin;
          that.TotalHealthPayin = result["Data"].TotalHealthPayin;
          that.TotalNon_MotorPayin = result["Data"].TotalNon_MotorPayin;
          that.TotalLifePayin = result["Data"].TotalLifePayin;
          that.TotalTravelPayin = result["Data"].TotalTravelPayin;
          that.TotalPaPayin = result["Data"].TotalPaPayin;
          that.TotalPO = result["Data"].TotalPO;
          that.TotalPayin = result["Data"].TotalPayin;
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
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
    var Mobile_number = "";
    Mobile_number = prompt("Enter mobile number", Mobile);
    // if (Mobile_number != "") {
    if (Mobile_number != null && Mobile_number.trim() !== "") {
      this.SendMail(Id, Mobile_number, "Mobile");
    } else {
      alert("Invalid Mobile!");
      return false;
    }
  }

  RaiseClaimPoupup(SrId: any) {
    const that = this;

    this.ClaimRaiseSrId = SrId;
    // const formData = new FormData();
    // formData.append("User_Id", this.api.GetUserData("Id"));
    // formData.append("User_Type", this.api.GetUserType());
    // formData.append("SrId", SrId);

    // // this.api.IsLoading();
    // this.api.HttpPostType("Claim/AddClaimpolicies", formData).then(
    //   (result: any) => {
    //     // this.api.HideLoading();
    //     // alert();
    //     if (result["Status"] == true) {
    //       this.api.Toast("Success", result["Message"]);
    //     } else {
    //       this.api.Toast("Warning", result["Message"]);
    //     }
    //   },
    //   (err) => {
    //     // this.api.HideLoading();
    //     this.api.Toast(
    //       "Warning",
    //       "Network Error : " + err.name + "(" + err.statusText + ")"
    //     );
    //   }
    // );
  }

  RaiseClaim() {
    this.isSubmitted1 = true;
    if (this.AddCatForm.invalid) {
      return;
    } else {
      // alert();
      var fields = this.AddCatForm.value;
      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("SrId", this.ClaimRaiseSrId);
      formData.append("ClaimType", fields["ClaimType"]);
      formData.append("DriverName", fields["DriverName"]);
      formData.append("Mobile", fields["Mobile"]);

      // console.log(formData);
      this.api.IsLoading();
      this.api.HttpPostType("Claim/AddClaimpolicies", formData).then(
        (result: any) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
          } else {
            this.api.Toast("Warning", result["Message"]);
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
  }
  // RaiseEndrosment(id:any){

  //   this.router.navigateByUrl('/endosment/details-form/'+id);
  // }

  onPanCardInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value.toUpperCase();
    const firstValue = inputValue.substring(0, 1);
    const numericPart = inputValue.substring(1, 10);
    let updatedValue = "";
    if (firstValue !== "" && this.isValid(firstValue, /^[6-9]+$/)) {
      updatedValue += firstValue;
    } else {
      updatedValue += firstValue.slice(0, -1);
    }
    if (numericPart !== "" && this.isValid(numericPart, /^[0-9]+$/)) {
      updatedValue += numericPart;
    } else {
      updatedValue += numericPart.slice(0, -1);
    }

    this.AddCatForm.get("Mobile").setValue(updatedValue);
  }

  private isValid(value: string, regex: RegExp): boolean {
    return regex.test(value);
  }

  Qc_Rejected(Id: any) {
    this.api.IsLoading();
    const formData = new FormData();
    formData.append("Id", Id);

    this.api
      .HttpPostTypeBms(
        "../v2/sr/Submit/UrlExpired?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType(),
        formData
      )
      .then((result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          let currentDate = new Date();
          let rejectDate = new Date(result["Reject_date"]);

          const diffTime = currentDate.getTime() - rejectDate.getTime();
          const diffDays = diffTime / (1000 * 3600 * 24);
          //  const diffDays = 8;

          if (diffDays > 7) {
            this.api.Toast("Warning", "URL has been  Expired");
            return;
          } else {
            window.open(
              `https://www.squareinsurance.in/policy-rejected-qc?id=${Id}`,
              "_blank"
            );
          }
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      })
      .catch((err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error: " + err.name + " (" + err.statusText + ")"
        );
      });
  }
} //end
