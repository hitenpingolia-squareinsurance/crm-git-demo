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
import { ViewDetailsModalComponent } from "../view-details-modal/view-details-modal.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  SrId: string;
  SR_NO: string;
  cancelId: string;
  LOB: string;
  PolicyNo: string;
  CustomerName: string;
  CustomerMobile: string;
  Company: string;
  DownloadUrl: string;
  Vehicle_No: string;
  Policy_Type: string;
  AddedByDetails: string;
  status: string;
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
  selector: "app-manage-endosment",
  templateUrl: "./manage-endosment.component.html",
  styleUrls: ["./manage-endosment.component.css"],
})
export class ManageEndosmentComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dataAr: ColumnsObj[];

  ActivePage: string = "Default";

  searchForm: FormGroup;
  ActionType: any = "";
  buttonDisable = false;

  isSubmitted = false;
  Is_Export: any = 0;
  quotationId: any = [];
  currentUrl: string;
  TotalFiles: number;
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

    this.viewEndosmentRequestsData();
  }

  //===== FETCH ALL SURVEY REQUEST DATA =====//
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
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/b-crm/Endosment/fetchManageRequestsData?User_Id=" +
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
            this.buttonDisable = false;
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

  //===== ACCEPT CANCELLATION REQUEST =====//
  acceptEndosmentRequest(endosmentId: any) {
    var Confirms = confirm("Are You Sure..!");

    if (Confirms == true) {
      const formData = new FormData();
      formData.append("loginId", this.api.GetUserData("Id"));
      formData.append("loginType", this.api.GetUserType());
      formData.append("endosmentId", endosmentId);

      this.api.IsLoading();
      this.api
        .HttpPostType("b-crm/Endosment/acceptEndosmentRequest", formData)
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
    }
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

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //===== OPEN DIALOG BOX =====//
  openDialog(qid: any, right: any) {
    const dialogConfig = this.dialog.open(ViewDetailsModalComponent, {
      width: "90%",
      height: "80%",
      disableClose: true,
      data: { qid: qid, right: right },
    });

    dialogConfig.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  //===== VIEW DOCUMENTS ====//
  ViewDocument(name) {
    let url;
    url = name;
    // console.log(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
} //END
