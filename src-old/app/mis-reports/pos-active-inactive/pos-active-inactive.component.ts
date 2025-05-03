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
import { FollowUpReportComponent } from "../../modals/follow-up-report/follow-up-report.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { PrimerejectdetailspopupComponent } from "../../modals/primerejectdetailspopup/primerejectdetailspopup.component";
import { AddprimerequestpopupComponent } from "../../modals/addprimerequestpopup/addprimerequestpopup.component";
import { GemsDetailsViewRemarkComponent } from "../../modals/gems-details-view-remark/gems-details-view-remark.component";
import { ViewgemsdetailspopupComponent } from "../../modals/viewgemsdetailspopup/viewgemsdetailspopup.component";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { PosDetailsComponent } from "../../modals/pos-details/pos-details.component";
import { PoliciesDataComponent } from "../../modals/policies-data/policies-data.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  Status: any;
  Name: any;
  AgentId: any;
  Email: string;
  Mobile_No: string;
  Employee: any;
  Busniess: string;
  Totalpolicy: string;
  LastLogin: string;
  LastModifiedDate: string;
  CreateDate: string;
  NetPremium: string;
  TotalPolicy: string;
  LastPolicyDate: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalPos: number;
  StatusActiveInactive: string = "";
  percetage: string;
  FilterPolicyData: any[];
}

@Component({
  selector: "app-pos-active-inactive",
  templateUrl: "./pos-active-inactive.component.html",
  styleUrls: ["./pos-active-inactive.component.css"],
})
export class PosActiveInactiveComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

  ActivePage: string = "Default";
  SearchForm: FormGroup;
  isSubmitted = false;

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";

  QidSr: any;

  //selected
  currentUrl: string;
  PageType: string;
  urlSegment: string;
  Total: number;
  TotalPos: any;
  StatusActiveInactive: any = "";
  percetage: any;
  urlSegmentRoot: string;
  dataArToDate: string;
  dataArFromDate: string;
  WhatsAppCheck: any;

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
    this.SearchForm = this.fb.group({});
    this.api.TargetComponent.subscribe(
      (page) => {
        // console.log(page);
        if (page == "Prime" || page == "Prime") {
          this.Get();
        }
      },
      (err) => {}
    );
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");

    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    if (this.urlSegment == "active-inactive-pos-reports") {
      this.PageType = "Reports";
    } else {
      this.PageType = "";
    }
    this.Get();
    this.setWhatsAppHref();
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

  //
  // if (this.urlSegment == "active-inactive-pos-reports") {
  //   var urls = "/V2/Reports/fetchActiveInactiveReportData";
  // } else if (this.urlSegmentRoot == "custom-reports") {
  //   urls = "/b-crm/customreports/fetchCustomPosActiveReport";

  //  } else {
  //   urls = "/b-crm/reports/fetchActiveInactiveReportData2";
  // }

  //===== GET POS DATA DATATABLE =====//
  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };
    if (this.urlSegment == "active-inactive-pos-reports") {
      var urls = "/V2/PosActivationReport/fetchActiveInactiveReportData";
    } else if (this.urlSegmentRoot == "custom-reports") {
      urls = "/b-crm/customreports/fetchCustomPosActiveReport";
    } else {
      urls = "/b-crm/reports/fetchActiveInactiveReportData6";
    }

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
                urls +
                "?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&PageType=" +
                this.PageType +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;
            
            that.dataAr = resp.data;
           
            that.FilterData = resp.FilterPolicyData;
            that.Total = resp.recordsTotal;
            this.TotalPos = resp.TotalPos;
            this.StatusActiveInactive = resp.StatusActiveInactive;
            this.percetage = resp.percetage;

            if (that.dataAr.length > 0) {
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
              FilterPolicyData: [],
            });
          });
      },
    };
  }

  //   //===== GET POS DATA DATATABLE =====//
  //   Get() {
  //     const httpOptions = {
  //       headers: new HttpHeaders({
  //         Authorization: "Bearer " + this.api.GetToken(),
  //       }),
  //     };

  //     // fetchActiveInactiveReportData
  //     if (this.urlSegment == "active-inactive-pos-reports") {
  //       var urls = "/V2/Reports/fetchActiveInactiveReportData";
  //     } else if (this.urlSegmentRoot == "custom-reports") {
  //       urls = "/b-crm/customreports/fetchCustomPosActiveReport";

  //      } else {
  //       urls = "/b-crm/reports/fetchActiveInactiveReportData2";
  //     }

  //     const that = this;

  //     this.dtOptions = {
  //       pagingType: "full_numbers",
  //       pageLength: 10,
  //       serverSide: true,
  //       processing: true,
  //        dom: 'ilpftripl',
  // ````
  //       ajax: (dataTablesParameters: any, callback) => {
  //         that.http
  //           .post<DataTablesResponse>(
  //             environment.apiUrl +
  //               urls +
  //               "?User_Id=" +
  //               this.api.GetUserData("Id") +
  //               "&User_Type=" +
  //               this.api.GetUserType() +
  //               "&url=" +
  //               this.currentUrl +
  //               "&Action=" +
  //               this.ActionType +
  //               "&RightType=" +
  //               this.api.DataRightsGetNavigation(),
  //             dataTablesParameters,
  //             httpOptions
  //           )
  //           .subscribe((res:any) => {
  //var resp = JSON.parse(this.api.decryptText(res.response));
  //             that.dataAr = resp.data;
  //             that.FilterData = resp.FilterPolicyData;
  //             that.Total = resp.recordsTotal;
  //             this.TotalPos = resp.TotalPos;
  //             this.StatusActiveInactive = resp.StatusActiveInactive;
  //             this.percetage = resp.percetage;
  //             this.dataArToDate = resp['ToDate']['data'];
  //              this.dataArFromDate =resp['FromDate']['data'];
  //             if (that.dataAr.length > 0) {
  //             }

  //             callback({
  //               recordsTotal: resp.recordsTotal,
  //               recordsFiltered: resp.recordsFiltered,
  //               data: [],
  //               FilterPolicyData: [],
  //               FilterArray: [],
  //             });
  //           });
  //       },
  //     };

  //   }

  FollowUp(id: any): void {
    const dialogRef = this.dialog.open(FollowUpReportComponent, {
      width: "95%",
      height: "90%",
      data: { Id: id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.Get();
    });
  }

  ViewGemsDetails(Id: number) {
    const dialogRef = this.dialog.open(ViewgemsdetailspopupComponent, {
      width: "40%",
      height: "55%",
      data: { Id: Id },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.Get();
    });
  }
  AddPrimeRequest(Id: number) {
    const dialogRef = this.dialog.open(AddprimerequestpopupComponent, {
      width: "60%",
      height: "60%",
      data: { Id: Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);

      this.Get();
    });
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

  PoliciesData(Id: any, Type: any) {
    const dialogRef = this.dialog.open(PoliciesDataComponent, {
      width: "90%",
      height: "90%",
      disableClose: true,
      data: { Id: Id, type: Type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  //if (this.urlSegmentRoot == "custom-reports") {
  //   const that = this;
  //   this.dtOptions = {
  //     pagingType: "full_numbers",
  //     pageLength: 10,
  //     serverSide: true,
  //     processing: true,
  // dom: 'ilpftripl',
  //      ajax: (dataTablesParameters: any, callback) => {
  //       that.http
  //         .post<DataTablesResponse>(
  //           environment.apiUrl +
  //             urls +
  //             "?User_Id=" +
  //             this.api.GetUserData("Id") +
  //             "&User_Type=" +
  //             this.api.GetUserType() +
  //             "&url=" +
  //             this.currentUrl +
  //             "&PageType=" +
  //             this.PageType +
  //             "&Action=" +
  //             this.ActionType +
  //             "&RightType=" +
  //             this.api.DataRightsGetNavigation(),
  //           dataTablesParameters,
  //           httpOptions
  //         )
  //         .subscribe((res:any) => {
  // var resp = JSON.parse(this.api.decryptText(res.response));
  //           that.dataAr = resp.data;
  //           that.FilterData = resp.FilterPolicyData;
  //           that.Total = resp.recordsTotal;
  //           this.TotalPos = resp.TotalPos;
  //           this.StatusActiveInactive = resp.StatusActiveInactive;
  //           this.percetage = resp.percetage;
  //           this.dataArToDate = resp['ToDate']['data'];
  //            this.dataArFromDate =resp['FromDate']['data'];

  //           if (that.dataAr.length > 0) {
  //           }

  //           callback({

  //             recordsTotal: resp.recordsTotal,
  //             recordsFiltered: resp.recordsFiltered,
  //             data: [],
  //             FilterPolicyData: [],
  //           });
  //         });
  //     },
  //   };
  // }else{
  //    const that = this;
  //   this.dtOptions = {
  //     pagingType: "full_numbers",
  //     pageLength: 10,
  //     serverSide: true,
  //     processing: true,
  // dom: 'ilpftripl',
  //       ajax: (dataTablesParameters: any, callback) => {
  //         that.http
  //           .post<DataTablesResponse>(
  //             environment.apiUrl +
  //               urls +
  //               "?User_Id=" +
  //               this.api.GetUserData("Id") +
  //               "&User_Type=" +
  //               this.api.GetUserType() +
  //               "&url=" +
  //               this.currentUrl +
  //               "&PageType=" +
  //               this.PageType +
  //               "&Action=" +
  //               this.ActionType +
  //               "&RightType=" +
  //               this.api.DataRightsGetNavigation(),
  //             dataTablesParameters,
  //             httpOptions
  //           )
  //           .subscribe((res:any) => {
  //var resp = JSON.parse(this.api.decryptText(res.response));
  //             that.dataAr = resp.data;
  //             that.FilterData = resp.FilterPolicyData;
  //             that.Total = resp.recordsTotal;
  //             this.TotalPos = resp.TotalPos;
  //             this.StatusActiveInactive = resp.StatusActiveInactive;
  //             this.percetage = resp.percetage;
  //             this.dataArToDate = resp['ToDate']['data'];
  //              this.dataArFromDate =resp['FromDate']['data'];

  //             if (that.dataAr.length > 0) {
  //             }

  //             callback({

  //               recordsTotal: resp.recordsTotal,
  //               recordsFiltered: resp.recordsFiltered,
  //               data: [],
  //               FilterPolicyData: [],
  //             });
  //           });
  //       },
  //     };
  // }

  //new
  setWhatsAppHref(): any {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      this.WhatsAppCheck = true;
    } else {
      this.WhatsAppCheck = false;
    }
  }
}
