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
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ViewRequestModalComponent } from "../view-request-modal/view-request-modal.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  SR_NO: string;
  SrId: string;
  cancelId: string;
  LOB: string;
  PolicyNo: string;
  CustomerName: string;
  CustomerMobile: string;
  Company: string;
  DownloadUrl: string;
  Vehicle_No: string;
  Policy_Type: string;
  assignedToEmp: string;
  AddedByDetails: string;
  insert_date: string;
  status: any;
  TypeName: any;
  InsertDate: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-manage-cancellation",
  templateUrl: "./manage-cancellation.component.html",
  styleUrls: ["./manage-cancellation.component.css"],
})
export class ManageCancellationComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dataAr: ColumnsObj[];

  buttonDisable = false;

  ActivePage: string = "Default";

  searchForm: FormGroup;
  ActionType: any = "";

  isSubmitted = false;
  Is_Export: any = 0;
  TotalFiles: number;

  quotationId: any = [];

  currentUrl: string;
  rightType: string;

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
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined" && splitted[2] == "manage-requests") {
      this.rightType = "Manage";
    }
    this.viewCancellationRequestsData();
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
                "/b-crm/Cancellation/fetchManageRequestsData?User_Id=" +
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
            this.buttonDisable = false;
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

  //===== ACCEPT CANCELLATION REQUEST =====//
  acceptCancellationRequest(cancelId: any) {
    var Confirms = confirm("Are You Sure..!");

    if (Confirms == true) {
      const formData = new FormData();
      formData.append("loginId", this.api.GetUserData("Id"));
      formData.append("loginType", this.api.GetUserType());
      formData.append("cancelId", cancelId);

      this.api.IsLoading();
      this.api
        .HttpPostType(
          "b-crm/ManageCancellation/acceptCancellationRequest",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              this.Reload();
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
    } //comfirm
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
    this.Reload();
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //===== OPEN DIALOG BOX =====//
  openDialog(SrId: any, right: any) {
    const dialogConfig = this.dialog.open(ViewRequestModalComponent, {
      width: "90%",
      height: "80%",
      data: { SrId: SrId, right: right },
    });

    dialogConfig.afterClosed().subscribe((result: any) => {
      setTimeout(() => {
        // this.ResetDT();
        this.Reload();
      }, 500);
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
