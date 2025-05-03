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
import { AddprimerequestpopupComponent } from "../../modals/addprimerequestpopup/addprimerequestpopup.component";
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
import { FollowUpTeleRmComponent } from "..//follow-up-tele-rm/follow-up-tele-rm.component";
// AgentsReportDetailsComponent
import { AgentsReportDetailsComponent } from "src/app/modals/dsr-related/agents-report-details/agents-report-details.component";

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
  selector: "app-view-tele-rm",
  templateUrl: "./view-tele-rm.component.html",
  styleUrls: ["./view-tele-rm.component.css"],
})
export class ViewTeleRmComponent implements OnInit {
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
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/b-crm/reports/ViewTeleRmAgent?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Action=" +
                this.ActionType +
                "&Pos_Type=" +
                this.api.GetUserData("pos_type") +
                "&url=" +
                this.currentUrl
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
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

  FollowupTelerm(Id: any, Type: any) {
    const dialogRef = this.dialog.open(FollowUpTeleRmComponent, {
      width: "70%",
      height: "80%",
      disableClose: true,

      data: { Id: Id, type: Type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  // yuvraj

  //===== GET AGENTS BUSINESS =====//
  GetBusinessDetails(agent_id: any, agent_name: any): void {
    const dialogRef = this.dialog.open(AgentsReportDetailsComponent, {
      width: "75%",
      height: "50%",
      disableClose: true,
      data: { agent_id: agent_id, agent_name: agent_name },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
