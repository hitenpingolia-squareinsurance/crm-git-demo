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
import { ViewDetailsModalComponent } from "../view-details-modal/view-details-modal.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  SR_NO: string;
  LOB: string;
  TypeName: string;
  PolicyNo: string;
  CustomerName: string;
  CustomerMobile: string;
  Company: string;
  Vehicle_No: string;
  Policy_Type: string;
  insert_date: string;
  EndosmentId: string;
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
  selector: "app-view-endosment",
  templateUrl: "./view-endosment.component.html",
  styleUrls: ["./view-endosment.component.css"],
})
export class ViewEndosmentComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  ActivePage: string = "Default";
  searchForm: FormGroup;

  ActionType: any = "";

  isSubmitted = false;
  Is_Export: any = 0;

  quotationId: any = [];

  currentUrl: any = "";
  rightType: any = "";

  TotalFiles: number;

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
    this.rightType = "View";
    this.currentUrl = this.router.url;

    this.viewEndosmentRequestsData();
    this.api.TargetComponent.subscribe(
      (page) => {
        // console.log(page)
        if (page == "endrosment") {
          this.ResetDT();
        }
      },
      (err) => {}
    );
  }

  //===== FETCH ALL ENDOSMENT REQUEST DATA =====//
  viewEndosmentRequestsData() {
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
                "/b-crm/Endosment/viewEndosmentRequestsData?User_Id=" +
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

  //===== SEARCH DATATABLE DATA =====//
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
    this.viewEndosmentRequestsData();
    this.Is_Export = 0;
    this.ResetDT();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== OPEN DIALOG =====//
  openDialog(qid: any, right: any) {
    const dialogConfig = this.dialog.open(ViewDetailsModalComponent, {
      width: "90%",
      height: "80%",
      disableClose: true,
      data: { qid: qid, right: right },
    });

    dialogConfig.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }

  //===== VIEW DOCUMENTS ====//
  ViewDocument(name) {
    let url;
    url = name;
    // console.log(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
}
