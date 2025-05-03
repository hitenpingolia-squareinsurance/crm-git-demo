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

import { RenewalfollowformComponent } from "../renewalfollowform/renewalfollowform.component";
import { RenewalfollowdetailsComponent } from "../renewalfollowdetails/renewalfollowdetails.component";
import { EmailsendpopupsComponent } from "../emailsendpopups/emailsendpopups.component";
import { PolicydetailsComponent } from "../../modals/policydetails/policydetails.component";

import { RenewalnewgadiComponent } from "../../modals/renewalnewgadi/renewalnewgadi.component";
import { RenewalnoticeComponent } from "../../modals/renewalnotice/renewalnotice.component";
import { ViewSrDetailsComponent } from "../../modals/view-sr-details/view-sr-details.component";

import { RenewalonlinequoteCreationComponent } from "../../modals/renewalonlinequote-creation/renewalonlinequote-creation.component";

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
  RenewalQuery: any[];
  NetPremiumFilteredRecords: any;
}

@Component({
  selector: "app-renewalmanager",
  templateUrl: "./renewalmanager.component.html",
  styleUrls: ["./renewalmanager.component.css"],
})
export class RenewalmanagerComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  isSubmitted = false;
  buttonDisable = false;

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsingleselect: any = {};
  GlobelLOB: any = [];
  Ins_Compaines: any = [];
  SR_Session_Year: any = [];
  SRSource_Ar: any = [];

  Company_Ar: any = [];
  Renewals: any = [];
  LOB_Ar: any = [];
  Product_Ar: any = [];
  data_Ar: any = [];
  Source: any = [];

  Is_Export: any = 0;
  MaskingAgentMobile: any = "Temp";

  currentUrl: string;
  FilterDatatype: any;
  RenewalQuery: any[];
  MonthRenewal: any = [];
  urlSegment: string;
  loginType: string | null;
  NetPremiumFilteredRecords: any;
  TotalRow: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.SearchForm = this.fb.group({
      Lob: [""],
      DateOrDateRange: [""],
      Company: [""],
      FinancialYear: [""],
      PolicyFileType: [""],
      SearchValue: [""],
      Source: [""],
      ProductType: [""],
      Tab_Type: [""],
    });

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.SearchForm.get("Tab_Type").setValue([
      { Id: "45_Days", Name: "45 Days" },
    ]);

    this.currentUrl = this.router.url;

    var splitted = this.currentUrl.split("/");
    if (typeof splitted[3] != "undefined") {
      this.urlSegment = splitted[3];

      // alert(this.urlSegment);
    }
  }

  ngOnInit(): void {
    this.Get();
    // this.FilterDataType();
    // this.FilterData();
    // this.FilterDataGetMonthRenewal();
    this.loginType = this.api.GetUserType();
    this.currentUrl = this.router.url;
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

  FilterData() {
    this.api
      .HttpGetType(
        "V2/Renewal/index?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&url=" +
          this.currentUrl +
          "&PageType=ManageRequests"
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.data_Ar = result["Data"];
          } else {
            //alert(result['message']);
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          //// console.log(err);

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

  Renew(Quotation_Id) {
    alert(Quotation_Id);
  }

  ClearSearch() {
    //var fields = this.SearchForm.reset();

    this.dataAr = [];
    this.ResetDT();

    this.Is_Export = 0;
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
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
      pageLength: 20,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        this.api.Send_Renewal_mail_Set_Condition(0);

        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/V2/Renewal/GirdData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&PageType=ManageRequests&RightType=" +
                this.api.DataRightsGetNavigation()
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            this.api.Send_Renewal_mail_Set_Condition(1);

            that.FilterDatatype = resp.FilterData;
            that.RenewalQuery = resp.RenewalQuery;
            that.NetPremiumFilteredRecords = resp.NetPremiumFilteredRecords;
            that.TotalRow = resp.recordsFiltered;

            this.SharedRenewalQuery(that.RenewalQuery);
            // console.log(that.RenewalQuery);
            if (that.dataAr.length > 0) {
              //that.Is_Export = 1;
            }
            this.buttonDisable = false;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      //columns: [
      //		{ data: 'Id' },
      //		{ data: 'Type' }

      //]
    };
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
  GetUrl(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  ChangeStatusRenewals1(e: any, Id: number) {
    var Values = e.target.value;
    if (Values == "") this.api.Toast("Warning", "Status is mandatory..!");
    else {
      var Confirms = confirm("Are You Sure To Change Status?");
      if (Confirms == true) {
        this.api
          .HttpGetType(
            "V2/Renewal/ChangeStatus?Page=User&User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&Id=" +
              Id +
              "&Status=" +
              Values
          )
          .then(
            (result) => {
              if (result["status"] == true) {
                this.api.Toast("Success", result["msg"]);
                setTimeout(() => {
                  this.ResetDT();
                }, 500);
              } else {
                this.api.Toast("Warning", result["msg"]);
                setTimeout(() => {
                  this.router.navigate([result["data"]["Return"]]);
                }, 1000);
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

  ChangeStatusRenewals(e: any, Id: number, Action: string) {
    if (Action == "Button") {
      var Values = e;
    } else {
      var Values = e.target.value;
    }
    var Values2 = 1;

    if (Values == "") {
    } else {
      const dialogRef = this.dialog.open(RenewalfollowformComponent, {
        width: "60%",
        height: "60%",
        data: {
          Id: Id,
          Status: Values,
          Status2: Values2,
          ActionUser: "Manager",
        },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        setTimeout(() => {
          this.Reload();
          // console.log("works");
        }, 500);
      });
    }
  }
  Sendmails(ids, expierydates, types) {
    var Conirms = confirm("Are you sure...!");

    if (Conirms == false) return;

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("SrTableId", ids);
    formData.append("MailType", types);

    formData.append("ToEmail", "");
    formData.append("CCEmail", "");
    formData.append("ToEmailCommaSeprated", "");
    formData.append("UserType", "");
    formData.append("Days", expierydates);

    this.api.IsLoading();

    this.api
      .HttpPostType("WebPolicyMailRenewalReminder/SendManualMail", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
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

  DetailShowPopup(Id: number, Status: string) {
    const dialogRef = this.dialog.open(RenewalfollowdetailsComponent, {
      width: "60%",
      height: "60%",
      data: { Id: Id, Type: "Manager", Status: Status },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  ShowEmailPopups(
    Id: number,
    ExpiryDays,
    Agent_Mobile: string,
    Agent_Email: string,
    Customer_Mobile: string,
    Customer_Email: string,
    Lob: string
  ) {
    const dialogRef = this.dialog.open(EmailsendpopupsComponent, {
      width: "60%",
      height: "60%",
      data: {
        Id: Id,
        Type: "User",
        Days: ExpiryDays,
        Agent_Mobile: Agent_Mobile,
        Agent_Email: Agent_Email,
        Customer_Mobile: Customer_Mobile,
        Customer_Email: Customer_Email,
        Lob: Lob,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  GetPolicyDetails(Type: any) {
    const dialogRef = this.dialog.open(ViewSrDetailsComponent, {
      width: "75%",
      height: "75%",
      data: { Id: Type },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  QuoteToWeb(Url) {
    var UserDatas = this.api.GetUserData("Id");
    var GetUserType = this.api.GetUserType();

    let a = document.createElement("a");
    a.target = "_blank";
    if (GetUserType == "employee") {
      a.href =
        this.api.ReturnWebUrl() +
        "/redirecting-session-users/" +
        GetUserType +
        "/" +
        btoa(UserDatas) +
        "?ReturnUrl=" +
        Url;

      // a.href =
      //   this.api.ReturnWebUrl() +
      //   "/Prequotes/SetSessionEmployee/login/" +
      //   btoa(UserDatas) +
      //   "?ReturnUrl=" +
      //   Url;
    } else {
      if (GetUserType == "user") {
        GetUserType = "agent";
      }

      a.href =
        this.api.ReturnWebUrl() +
        "/redirecting-session-users/" +
        GetUserType +
        "/" +
        btoa(UserDatas) +
        "?ReturnUrl=" +
        Url;

      // a.href =
      //   this.api.ReturnWebUrl() +
      //   "/agents/check/" +
      //   btoa(UserDatas) +
      //   "/" +
      //   btoa(GetUserType) +
      //   "/login?ReturnUrl=" +
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
  //     a.href = Url;
  //   } else {
  //     a.href = Url;
  //   }
  //   a.click();
  // }

  SharedRenewalQuery(value: any) {
    // console.log(value);
    this.api.RenewalQueryGet(value);
  }

  FilterDataGetMonthRenewal() {
    this.api
      .HttpGetType(
        "V2/Renewal/GetMonthRenewal?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&PageType=ManageRequests"
      )
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.MonthRenewal = result["Data"];
          } else {
            //alert(result['message']);
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          //// console.log(err);

          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  CommonFunctionRenewalCreate(Quotation, Typess, File_Type, RegNo, RegNoss) {
    var confirms = confirm("Are You Sure..!");

    if (confirms == true) {
      //true

      const formData = new FormData();
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      formData.append("Quotation", Quotation);
      formData.append("RegNo", RegNo);
      formData.append("File_Type", File_Type);

      this.api.IsLoading();
      this.api
        .HttpPostType(
          "V2/Renewal/RenewalQuoteMotor2/quick/manager/" + Typess,
          formData
        )
        .then(
          (result) => {
            //// console.log(result);

            if (result["status"] == true) {
              this.QuoteToWeb(result["Url"]);

              if (File_Type == "New") {
                this.Reload();
              }
            } else {
              this.buttonDisable = false;
              const msg = "msg";
              this.api.Toast("Warning", result["msg"]);
            }
            this.api.HideLoading();
          },
          (err) => {
            const newLocal = "Warning";
            this.api.Toast(
              newLocal,
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
            this.api.HideLoading();
          }
        );
    }
  }

  CreateQuickRenewalQuote(Quotation, Typess, File_Type, RegNoss) {
    if (File_Type == "New") {
      const dialogRef = this.dialog.open(RenewalnewgadiComponent, {
        width: "50%",
        height: "50%",
        disableClose: true,
        data: { RegNoss: RegNoss },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        //// console.log(result.RegNo+' '+result.HitTypes);
        if (result.HitTypes == 1) {
          this.CommonFunctionRenewalCreate(
            Quotation,
            Typess,
            File_Type,
            result.RegNo,
            RegNoss
          );
        }
      });
    } else
      this.CommonFunctionRenewalCreate(
        Quotation,
        Typess,
        File_Type,
        "",
        RegNoss
      );
  } //true

  showRenewalNotoces(Id: number) {
    const dialogRef = this.dialog.open(RenewalnoticeComponent, {
      width: "38%",
      height: "60%",
      disableClose: true,
      data: { Id: Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  ChangeStatus(Type: any) {
    this.api.ChangeRenwalTabtype(Type);
  }

  //===== SR POPUP =====//
  SrPopup(type, row_Id): void {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Code"));
    formData.append("Source", "CRM");

    this.api
      .HttpPostTypeBms("../v2/sr/life/LifeSubmit/GetUserId", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            var baseurl = "https://crm.squareinsurance.in/";
            var url =
              baseurl +
              "business-login/form/general-insurance/" +
              type +
              "/crm/" +
              result["User_Id"] +
              "/" +
              row_Id +
              "/web";
            window.open(url, "", "fullscreen=yes");
          } else {
            this.api.Toast("Error", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again! " + err.message
          );
        }
      );
  }

  CreateNewQuoteofflinePolicy(SrId, FileType, RegNo, ProductType) {
    const dialogRef = this.dialog.open(RenewalonlinequoteCreationComponent, {
      width: "50%",
      height: "50%",
      disableClose: true,
      data: {
        SrId: SrId,
        FileType: FileType,
        RegNo: RegNo,
        ProductType: ProductType,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  } //true

  CreateNewSr(row_Id: any, SrNo: any, LOB: any): void {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Code"));
    formData.append("Source", "CRM");

    this.api
      .HttpPostTypeBms("../v2/sr/life/LifeSubmit/GetUserId", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            var baseurl = "https://crm.squareinsurance.in/";
            var url =
              baseurl +
              "business-login/form/general-insurance/0/crm/" +
              result["User_Id"] +
              "/" +
              row_Id +
              "/web-renewal-" +
              LOB +
              "-" +
              SrNo +
              "";
            window.open(url, "", "fullscreen=yes");
          } else {
            this.api.Toast("Error", result["Message"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error, Please try again! " + err.message
          );
        }
      );
  }
  ShowMaskingField(i) {
    this.MaskingAgentMobile = i;
  }
}
