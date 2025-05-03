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
import { AddAdvisorComponent } from "../../modals/add-advisor/add-advisor.component";
import { GeotagComponent } from "src/app/modals/geotag/geotag.component";

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
  selected: boolean;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
  FilterToTalPolicyAndPremium: any;
  FilterArray: any;
  Filter: any;
}
@Component({
  selector: "app-view-posp",
  templateUrl: "./view-posp.component.html",
  styleUrls: ["./view-posp.component.css"],
})
export class ViewPospComponent implements OnInit {
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
  ChangePospData: any;

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
  options: number[] = [];
  selectedOption: any;
  mobile_creation_id: any;
  ChangePospId: any;
  ChangePospIdAgentId: any;
  referenceData: any;
  AlLEmployeeData: any;
  formBuilder: any;
  UpdatePospReportingForm: FormGroup;
  VerticalData: any;
  selectedItems: any[] = [];
  selectedIds: any;
  selectAll: boolean = false;

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  ChangePospRm: any;
  WhatsAppCheck: any;
  ChangePospVertical: any;
  dataArr: any[];
  checkckeckboxcheck: number;
  dataArra: unknown;
  UpdateRmType: any;
  totalrecord: any;
  WhereQuery: any;
  bulkmappingupdateform: FormGroup;
  selectedFiles: any;
  file: any;
  MapapingPosData: any;

  hasAccess: boolean = true;
  errorMessage: string = '';


  dropdownMultiselectSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.bulkmappingupdateform = this.fb.group({
      remarks: [""],
      file: [""],
    });

    this.dropdownMultiselectSettingsType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.financialYearVal = [{ Id: "2021-22", Name: "2021-22" }];

    this.UpdatePospReportingForm = this.fb.group({
      vertical: ["", Validators.required],
      posp: [""],
      reference: ["", Validators.required],
    });

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

  CloseModel() {
    throw new Error("Method not implemented.");
  }

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      // console.log(this.selectedFiles);
      // console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;

      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (ext == "csv") {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + ' kb');

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "file") {
            this.bulkmappingupdateform.get("file").setValue("");
          }
        } else {
          if (Type == "file") {
            this.file = this.selectedFiles;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast("Warning", "Please choose vaild file ! Example :- csv");

        if (Type == "file") {
          this.bulkmappingupdateform.get("file").setValue("");
        }
      }
    }
  }

  ShowMaskingField(i) {
    this.Masking = i;
  }
  ngOnInit(): void {
    for (let i = 5; i <= 100; i += 5) {
      this.options.push(i);
    }
    this.currentUrl = this.router.url;
    this.Get();

    this.Login_Type = this.api.GetUserType();
    this.setWhatsAppHref();
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
            this.dataArr = resp.data;
            this.WhereQuery = resp.Filter;
            this.totalrecord = resp.recordsFiltered;
          

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

  UpdateBABPstatus(agent_id, statuslabel, status) {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("agent_id", agent_id);
    formData.append("statuslabel", statuslabel);
    formData.append("Status", status);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api.HttpPostType("PospManegment/createbAbprights", formData).then(
        (result: any) => {
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




  promptfn(m) {
    var msg = prompt(m, "");
    if (msg == null) {
      return "";
    }
    if (msg == "") {
      return this.promptfn(m);
    } else {
      return msg;
    }
  }

  UpdateStatusPosp(id: any, status: any, columnName: any, primaryId: any, column_Name : any) {

    var remark = "";
    remark = this.promptfn("Please Enter  Remark");

    if (remark != "") {
      if (
        remark == "ok" ||
        remark == "OK" ||
        remark == "okay" ||
        remark == "OKAY"
      ) {
        alert("Please enter vaild Reason/Remark.");
        return;
      }

    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("PospId", id);
    formData.append("Id", primaryId);
    formData.append("Status", status);
    formData.append("ColName", columnName);
    formData.append("column_Name", column_Name);
    formData.append("Remark", remark);


      this.api.IsLoading();
      this.api.HttpPostType("PospManegment/UpdateStatusPosp", formData).then(
        (result: any) => {
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
        (result: any) => {
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
        (result: any) => {
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
            (result: any) => {
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

  Download_Agreement(id) {
    const formData = new FormData();
    formData.append("Id", id);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api.HttpPostType("MyPos/GenerateAgreement", formData).then(
        (result: any) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.Toast("Success", result["msg"]);

            // window.location.href = result["Url"];
            window.open(result["Url"], "_blank");

            // this.ResetDT();
          } else {
            // this.ResetDT();

            const msg = "msg";
            // this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // this.ResetDT();

          this.api.HideLoading();
        }
      );
    }
  }

  Download_Certificate(id) {
    const formData = new FormData();
    formData.append("Id", id);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api.HttpPostType("MyPos/GenerateCertified", formData).then(
        (result: any) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.Toast("Success", result["msg"]);
            // window.location.href = result["Url"];
            window.open(result["Url"], "_blank");

            // window.Locat
            // this.ResetDT();
          } else {
            // this.ResetDT();

            const msg = "msg";
            // this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // this.ResetDT();

          this.api.HideLoading();
        }
      );
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
        (result: any) => {
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

  MailLogs(id, agent_id, agreementStatus) {
    const dialogRef = this.dialog.open(MailLogsComponent, {
      width: "50%",
      height: "80%",
      disableClose: true,
      data: { id: id, agentCode: agent_id, agreementStatus: agreementStatus },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  UrlRedirection(id: any, agentCode: any, type: any) {
    const dialogRef = this.dialog.open(UrlRedirectionComponent, {
      width: "50%",
      height: "80%",
      disableClose: true,
      data: { id: id, agentCode: agentCode, type: type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }
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
  // selectedOption
  value_Update(id_val: any) {
    this.mobile_creation_id = id_val;
  }

  submitFormData() {
    console.log("Selected option:", this.selectedOption);

    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());
    formData.append("mobile_creation", this.selectedOption);
    formData.append("mobile_creation_id", this.mobile_creation_id);

    this.api.IsLoading();
    this.api.HttpPostType("PospManegment/updateValue", formData).then(
      (result: any) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.api.Toast("Success", result["msg"]);
          const closebutton = document.getElementById("closemodal");
          closebutton.click();
          this.ResetDT();
        } else {
          this.ResetDT();
          const msg = "msg";
        }
      },
      (err) => {
        this.ResetDT();

        this.api.HideLoading();
      }
    );
  }

  AddAdvisor(Id: any, AgentId: any, Type: any, UserType: any) {
    const dialogRef = this.dialog.open(AddAdvisorComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { Id: Id, AgentId: AgentId, Type: Type, UserType: UserType },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.ResetDT();
      this.Reload();
    });
  }

  UpdatePospReporting(Id, AgentId, type) {
    this.ChangePospId = Id;
    this.UpdateRmType = type;
    this.ChangePospIdAgentId = AgentId;
    this.UpdatePospReportingForm.reset();
    this.getEmployee(0);
  }

  getEmployee(event) {
    const formData = new FormData();
    var fields = this.UpdatePospReportingForm.value;

    formData.append("agentId", this.ChangePospId);
    formData.append("AgentRmChange", "1");
    formData.append("Query", this.WhereQuery);
    formData.append("UpdateRmType", this.UpdateRmType);
    formData.append("vertical", JSON.stringify(fields["vertical"]));

    this.api.HttpPostType("MyPos/GetEmployee", formData).then(
      (result: any) => {
        if (result["status"] == true) {
          if (event == 0) {
            this.VerticalData = result["VerticalData"];
          }
          this.AlLEmployeeData = result["Data"];
          this.ChangePospRm = result["PospRm"];
          this.MapapingPosData = result["MapapingPosData"];
          this.ChangePospVertical = result["PospRmVertical"];
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

  ChangePospReporting() {
    var Fields = this.UpdatePospReportingForm.value;
    if (this.UpdateRmType == "ChangeRM") {
      var msg = "Are You sure you want to change reporting";
    } else if (this.UpdateRmType == "TeleRm") {
      var msg =
        "Are You sure you want to change Tele reporting POSP Count =" +
        this.totalrecord;
    } else {
      var msg =
        "Are You sure you want to change reporting POSP Count =" +
        this.totalrecord;
    }

    var r = confirm(msg);
    if (r == true) {
      const formData = new FormData();
      formData.append("agentId", this.ChangePospId);
      formData.append("Query", this.WhereQuery);
      formData.append("new_rm_jd", Fields["reference"][0]["Id"]);
      formData.append("UpdateRmType", this.UpdateRmType);
      formData.append("Pospdata", JSON.stringify(Fields["posp"]));

      this.api
        .HttpPostType("PospReporting/UpdatePospReportingCoreRmNew", formData)
        .then(
          (result) => {
            if (result["status"] == true) {
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
  }

  getdata(id) {
    this.api.IsLoading();
    this.api.HttpGetType("PospReporting/ViewPospReporting?AgentId=" + id).then(
      (result) => {
        this.api.HideLoading();
        alert();
        this.dataArra = result;
      },
      (err) => {
        this.api.HideLoading();
        this.dataArra = err["error"]["text"];
        // console.log( this.dataArr);
      }
    );
  }

  //new
  setWhatsAppHref(): any {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      this.WhatsAppCheck = true;
    } else {
      this.WhatsAppCheck = false;
    }
  }

  // New Function By Tarun

  getSelectedRows() {
    var confirms = confirm(
      "Are You Sure You Want To Change Square Branding Status..!"
    );
    if (confirms == true) {
      this.selectedItems = this.dataArr.filter((row) => row.selected);
      this.selectedIds = this.selectedItems.map((item) => item.Id);

      console.log(this.selectedIds);

      const formData = new FormData();

      formData.append("SelectedIds", this.selectedIds);
      formData.append("login_type", this.api.GetUserType());
      formData.append("login_id", this.api.GetUserData("Id"));

      this.api.IsLoading();

      this.api
        .HttpPostType("PospManegment/Square_branding_policy_pdf", formData)
        .then(
          (result: any) => {
            this.api.HideLoading();
            console.log(result);

            if (result["status"] == 1) {
              this.api.Toast("Success", result["msg"]);
              this.selectAll = false;
              this.Reload();
              this.selectRow("");
            } else {
              const msg = "msg";
              //alert(result['message']);
              this.api.Toast("Warning", result["msg"]);
              this.selectRow("");
            }
          },
          (err) => {
            // Error log
            // console.log(err);

            this.api.HideLoading();
            const newLocal = "Warning";
            this.api.Toast(
              newLocal,
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
            //this.api.ErrorMsg('Network Error :- ' + err.message);
          }
        );
    }
  }

  headerClick(event: Event) {
    event.stopPropagation();
  }

  selectAllRows() {
    this.dataArr.forEach((row) => {
      row.selected = this.selectAll;
    });
    if (!this.selectAll) {
      // If "Select All" is unchecked, uncheck the header checkbox
      this.selectAll = false;
    }
  }

  selectRow(row: any) {
    if (!row.selected) {
      this.selectAll = false;
      this.checkckeckboxcheck = 0;
    } else {
      this.checkckeckboxcheck = 1;

      // Check if all rows are selected
      if (this.dataAr.every((r) => r.selected)) {
        this.selectAll = true;
      }
    }
  }

  GeoTagButton(Id: any, email: any, mobile: any, geo_tag: any) {
    const dialogRef = this.dialog.open(GeotagComponent, {
      width: "60%",
      height: "60%",
      disableClose: true,
      data: { Id: Id, Email: email, Mobile: mobile, geoTag: geo_tag },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.ResetDT();
      this.Reload();
    });
  }
}
