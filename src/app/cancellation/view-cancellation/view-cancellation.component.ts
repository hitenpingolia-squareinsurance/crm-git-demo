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
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ViewRequestModalComponent } from "../view-request-modal/view-request-modal.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  SR_NO: string;
  SrId: string;
  LOB: string;
  PolicyNo: string;
  CustomerName: string;
  CustomerMobile: string;
  Company: string;
  Vehicle_No: string;
  Policy_Type: string;
  insert_date: string;
  DownloadUrl: string;
  status: string;
  InsertDate: string;
  AssignedTo: string;
  AssignedToMobile: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-view-cancellation",
  templateUrl: "./view-cancellation.component.html",
  styleUrls: ["./view-cancellation.component.css"],
})
export class ViewCancellationComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dataAr: ColumnsObj[];

  ActivePage: string = "Default";

  searchForm: FormGroup;
  ActionType: any = "";
  TotalFiles: number;

  isSubmitted = false;
  Is_Export: any = 0;

  quotationId: any = [];

  currentUrl: any = "";
  rightType: any = "";

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private uri: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.searchForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.rightType = "View";
    this.viewCancellationRequestsData();

    this.api.TargetComponent.subscribe(
      (page) => {
        if (page == "Cancellation") {
          this.ResetDT();
        }
      },
      (err) => {}
    );
  }

  //===== FETCH ALL SURVEY REQUEST DATA =====//
  viewCancellationRequestsData() {
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
                "/b-crm/Cancellation/viewCancellationRequestsData?User_Id=" +
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
            that.TotalFiles = resp.TotalFiles;

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
  }

  //===== FILTER DATA =====//
  SearchData(event: any) {
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

  //===== CLEAR FILTER =====//
  ClearSearch() {
    var fields = this.searchForm.reset();
    this.viewCancellationRequestsData();
    this.Is_Export = 0;
    this.ResetDT();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== OPEN DIALOG =====//
  openDialog(SrId: any, right: any) {
    const dialogConfig = this.dialog.open(ViewRequestModalComponent, {
      width: "90%",
      height: "80%",
      data: { SrId: SrId, right: right },
    });

    dialogConfig.afterClosed().subscribe((result: any) => {});
  }

  //===== VIEW DOCUMENTS ====//
  ViewDocument(name) {
    let url;
    url = name;
    // console.log(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
}
