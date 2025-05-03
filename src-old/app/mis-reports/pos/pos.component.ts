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
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}

@Component({
  selector: "app-pos",
  templateUrl: "./pos.component.html",
  styleUrls: ["./pos.component.css"],
})
export class PosComponent implements OnInit {
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
  Total: number;
  WhatsAppCheck: any;
  dataArra: unknown;
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
    this.Get();
    this.currentUrl = this.router.url;
    this.UserTypesView = this.activatedRoute.snapshot.url[0].path;

    if (this.UserTypesView == "pos") {
      this.PageType = "Reports";
    }
    this.setWhatsAppHref();
  }

  //===== SEARCH DATATABLE DATA =====//
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

  //===== GET POS DATA DATATABLE =====//
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
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/b-crm/Reports/fetchPosReportData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
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
            that.Total = resp.recordsFiltered;

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
      width: "60%",
      height: "60%",
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
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { Id: Id, type: Type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
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
}
