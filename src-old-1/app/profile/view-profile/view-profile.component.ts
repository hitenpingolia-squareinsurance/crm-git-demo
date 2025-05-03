import { DataTableDirective } from "angular-datatables";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ProfileApprovalComponent } from "../profile-approval/profile-approval.component";

class ColumnsObj {
  id: string;
  SrNo: string;
  type: string;
  Name: string;
  Quantity: string;
  Add_stamp: string;
  Status: string;
  In_Stock: string;
  In_Queue: string;
  DistributeItem: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-view-profile",
  templateUrl: "./view-profile.component.html",
  styleUrls: ["./view-profile.component.css"],
})
export class ViewProfileComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  Is_Export: number;
  loadAPI: Promise<any>;

  ActionType: any = "";
  searchform: FormGroup;
  isSubmitted = false;
  dtElements: any;
  currentUrl: string;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.searchform = this.formBuilder.group({
      SearchValue: [""],
    });
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    // console.log(this.currentUrl);
    this.Get();
    // this.SearchBtn();
  }

  ClearSearch() {
    var fields = this.searchform.reset();
    // this.dataAr = [];
    this.ResetDT();
  }

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

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  AcceptAssignQuote(id, requestid, url) {
    var Id = id;
    var RequestId = requestid;
    var url = url;

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "Profile/ProfileAccept?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Id=" +
            Id +
            "&requestid=" +
            RequestId +
            "&url=" +
            url
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              // this.RequestedQuote = result["data"];
              this.Get();
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
                "/Profile/ViewProfile?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Action=" +
                this.ActionType +
                "&url=" +
                this.currentUrl
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            // console.log(that.dataAr);
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

  profileapproval(id: any, requestId: any, status: any, url: any) {
    const dialogRef = this.dialog.open(ProfileApprovalComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { Id: id, RequestId: requestId, Status: status, url: url },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      //  this.ResetDT();
      this.Get();
    });
  }
}
