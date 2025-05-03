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

import { PosDetailsComponent } from "../../modals/pos-details/pos-details.component";
import { DocumentsComponent } from "../../useragent/documents/documents.component";
import { PospUpdateStatusComponent } from "../posp-update-status/posp-update-status.component";
import { MailLogsComponent } from "../mail-logs/mail-logs.component";
import { UrlRedirectionComponent } from "../url-redirection/url-redirection.component";
import { PospRightsComponent } from "../posp-rights/posp-rights.component";
import { ConversationalSettingsComponent } from "../conversational-settings/conversational-settings.component";
// import { InvoiceComponent } from "../invoice/invoice.component";

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
  selector: 'app-e-partner',
  templateUrl: './e-partner.component.html',
  styleUrls: ['./e-partner.component.css']
})
export class EPartnerComponent implements OnInit {

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
  isSubmitted2 = false;

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
  urlSegment: string;
  urlSegmentRoot: string;
  urlSegmentSub: string;
  posStatusModalValue: unknown;
  Masking: any = "Temp";
  MaskingType: any = "Temp";
  RejectAgentForm: any;
  RejectedPospId: any;
  RejectedPospAgentId: any;
  RejectedPospName: any;
  dialogRef: any;

  hasAccess: boolean = true;
  errorMessage: string = '';

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
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

    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }

    if (typeof splitted[3] != "undefined") {
      this.urlSegmentSub = splitted[3];
    }

    this.RejectAgentForm = this.fb.group({
      Remark: [""],
    });
  }
  ShowMaskingField(i) {
    this.Masking = i;
  }
  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.Get();

    this.Login_Type = this.api.GetUserType();
  }
  CopyText(inputElement) {
    this.api.CopyText(inputElement);
    // navigator.clipboard.writeText(inputElement);
  }
  get formControls() {
    return this.SearchForm.controls;
  }

  get formControls2() {
    return this.RejectAgentForm.controls;
  }

  ClearSearch() {
    this.buttonDisable = true;
    var fields = this.SearchForm.reset();
    this.ResetDT();
    this.financialYearVal = [{ Id: "2021-22", Name: "2021-22" }];
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
  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "Table1") {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
      }
    });
  }

  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer '+this.api.GetToken(),
      }),
    };
    this.buttonDisable = true;

    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
              "/PospManegment/FetchAgentData?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&url=" +
              this.currentUrl +
              "&Action=" +
              this.ActionType +
              "&Pos_Type=" +
              this.api.GetUserData("pos_type")),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((resp:any) => {
            var resp = JSON.parse(this.api.decryptText(resp.response));
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;
            this.buttonDisable = false;
            that.dataAr = resp.data;
          

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

  PospDetails(Id: any, Type: any) {
    const dialogRef = this.dialog.open(PosDetailsComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { Id: Id, type: Type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  UpdateDocs(Id: any, Type: any) {
    const dialogRef = this.dialog.open(DocumentsComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { id: Id, type: Type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  Transfer(Id: any, Staus: any, ActionType: any) {
    const dialogRef = this.dialog.open(PospUpdateStatusComponent, {
      data: { Id: Id, Staus: Staus, ActionType: ActionType },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  //UPDATE EMPLOYEE STATUS
  UpdateStatusPosp(id: any, status: any, columnName: any, primaryId: any) {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("PospId", id);
    formData.append("Id", primaryId);
    formData.append("Status", status);
    formData.append("ColName", columnName);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api.HttpPostType("PospManegment/UpdateStatusPosp", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.Reload();
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
  }

  passManual(Id: any, Action: any) {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Id", Id);
    formData.append("Action", Action);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api.HttpPostType("PospManegment/PassManual", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.Reload();
          } else {
            this.Reload();

            const msg = "msg";
            // this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.Reload();

          this.api.HideLoading();
        }
      );
    }
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  SendMail(Id, type) {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Id", Id);
    var url = "";
    if (type == "Training Mail") {
      url = "PospManegment/ResendTrainingMail";
    } else if (type == "Certified Mail") {
      url = "PospManegment/SendCertifiedMail";
    }

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();

      this.api.HttpPostType(url, formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.Reload();
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
  }

  showRejectedPospDetails(Id: any, AgentId: any, Name: any) {
    this.RejectedPospId = Id;
    this.RejectedPospAgentId = AgentId;
    this.RejectedPospName = Name;
  }

  RejectUnderTrainingPosp(Id: any) {
    var fields = this.RejectAgentForm.value;
    this.isSubmitted2 = true;
    if (this.RejectAgentForm.invalid) {
      return;
    } else {
      const formData = new FormData();
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      formData.append("Id", Id);
      formData.append("Agree", "reject");
      formData.append("Remarks", fields["Remark"]);

      if (confirm("Are you sure !") == true) {
        this.api.IsLoading();
        this.api
          .HttpPostType("PospManegment/UpdatePosVerificationSatatus", formData)
          .then(
            (result) => {
              this.api.HideLoading();
              // console.log(result.status);
              // console.log(rresult["status"]);
              if (result["status"] == 1) {
                this.api.Toast("Success", result["msg"]);
                this.RejectAgentForm.reset();
                this.Reload();
                $("#ClosePOUPUP").trigger("click");
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
    }
  }

  SendAgreementMail(id, agent_id) {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("AgentId", id);
    formData.append("AgentCode", agent_id);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api.HttpPostType("Url_Redirection/SendMail", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.ResetDT();
          } else {
            this.ResetDT();

            const msg = "msg";
            // this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.ResetDT();

          this.api.HideLoading();
        }
      );
    }
  }
  
  // MailLogs(id, agent_id, agreementStatus) {
  //   const dialogRef = this.dialog.open(MailLogsComponent, {
  //     width: "50%",
  //     height: "80%",
  //     disableClose: true,
  //     data: { id: id, agentCode: agent_id, agreementStatus: agreementStatus },
  //   });

  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     this.Reload();
  //   });
  // }


  UrlRedirection(id: any, agentCode: any,agreementStatus:any) {
    const dialogRef = this.dialog.open(UrlRedirectionComponent, {
      width: "50%",
      height: "80%",
      disableClose: true,
      data: { id: id, agentCode: agentCode,agreementStatus: agreementStatus },
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      // this.CloseModel22();
      this.Get();
      this.ResetDT();
    });
  }


  // Invoice(id: any, agentCode: any,agreementStatus:any) {
  //   const dialogRef = this.dialog.open(InvoiceComponent, {
  //     width: "50%",
  //     height: "80%",
  //     disableClose: true,
  //     data: { id: id, agentCode: agentCode,agreementStatus: agreementStatus },
  //   });
    
  //   dialogRef.afterClosed().subscribe((result:any) => {
  //     // this.CloseModel22();
  //     // this.Get();
  //     // this.ResetDT();
  //   });
  // }


  // UrlRedirection(id: any, agentCode: any, type: any) {
  //   const dialogRef = this.dialog.open(UrlRedirectionComponent, {
  //     width: "50%",
  //     height: "80%",
  //     disableClose: true,
  //     data: { id: id, agentCode: agentCode, type: type },
  //   });

  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     this.Reload();
  //   });
  // }

  AppPOSPRights(agentCode: any) {
    const dialogRef = this.dialog.open(PospRightsComponent, {
      width: "40%",
      // height: "80%",
      disableClose: true,
      data: { agentCode: agentCode },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  Conversational_Settings(agentCode: any) {
    const dialogRef = this.dialog.open(ConversationalSettingsComponent, {
      width: "50%",
      // height: "80%",
      disableClose: true,
      data: { agentCode: agentCode },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  //new 
  view_partner(id:any){ 
    const encodedId = btoa(id);
    // alert(encodedId);
    this.router.navigate(['/epartner/e-partner', encodedId] ,{
    
  });
  }
}
