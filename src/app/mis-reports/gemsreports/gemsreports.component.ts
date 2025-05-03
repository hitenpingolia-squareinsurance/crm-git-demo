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
import { GemsTransactionComponent } from "../../modals/gems-transaction/gems-transaction.component";

import { EligibleComponentComponent } from "../eligible-component/eligible-component.component";

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
  selector: "app-gemsreports",
  templateUrl: "./gemsreports.component.html",
  styleUrls: ["./gemsreports.component.css"],
})
export class GemsreportsComponent implements OnInit {
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

  tempUserId: any;

  //selected
  currentUrl: string;
  PageType: string;
  Total: number;
  login_Id: any;
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
      (err) => { }
    );
  }

  ngOnInit(): void {
    this.login_Id = this.api.GetUserData("Id");
    console.log(this.login_Id);
    this.Get();
    this.currentUrl = this.router.url;
    this.UserTypesView = this.activatedRoute.snapshot.url[0].path;

    if (this.UserTypesView == "pos") {
      this.PageType = "Reports";
    }
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
    // alert();
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "kt_datatable") {
        //dtInstance.column(0).search(JSON.stringify(event)).draw();
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
              "/b-crm/Reports/fetchPosReportDataGems?User_Id=" +
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

            that.dataAr = resp.data;
            that.FilterData = resp.FilterPolicyData;
            that.Total = resp.recordsFiltered;

            console.log(this.dataAr);


            // this.tempUserId = this.api.GetUserData("Id");



            // if (that.dataAr.length > 0) {

            // }

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

  ViewGemsDetails(Id: number, FinancialYear: string) {
    const dialogRef = this.dialog.open(ViewgemsdetailspopupComponent, {
      width: "60%",
      height: "60%",
      data: { Id: Id, FinancialYear: FinancialYear, Type: "Reports" },
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

    dialogRef.afterClosed().subscribe((result: any) => { });
  }

  PoliciesData(Id: any, Type: any) {
    const dialogRef = this.dialog.open(PoliciesDataComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { Id: Id, type: Type },
    });

    dialogRef.afterClosed().subscribe((result: any) => { });
  }

  TransactionDetails(Id: any, FinancialYear: any) {
    const dialogRef = this.dialog.open(GemsTransactionComponent, {
      width: "80%",
      height: "80%",
      // disableClose: true,
      data: { Id: Id, FinancialYear: FinancialYear },
    });

    dialogRef.afterClosed().subscribe((result: any) => { });
  }

  EligibleComponent(Role_Id: any, Role_Type: any, Id: any, FinancialYear: any) {
    const dialogRef = this.dialog.open(EligibleComponentComponent, {
      width: "60%",
      height: "60%",
      data: { Role_Id: Role_Id, Role_Type: Role_Type, Id: Id, FinancialYear: FinancialYear },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);


      this.Get();
      this.ResetDT();

    });
  }
}
