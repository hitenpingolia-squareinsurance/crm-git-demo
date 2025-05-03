import { AddCurrentOpeningComponent } from "./../add-current-opening/add-current-opening.component";

import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";

import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ViewMoreComponent } from "../view-more/view-more.component";
import { EditCurrentOpeningComponent } from "../edit-current-opening/edit-current-opening.component";

class ColumnsObj {
  Id: string;
  Title: string;
  Experiance: string;
  RequiredCandidate: string;
  SrNo: string;
  Status: number;
  Date: any;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-view-current-opening",
  templateUrl: "./view-current-opening.component.html",
  styleUrls: ["./view-current-opening.component.css"],
})
export class ViewCurrentOpeningComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";

  currentUrl: string;
  RequestTypesFilter: boolean;
  PageType: string = "";


  hasAccess: boolean = true;
  errorMessage: string = '';

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.subscribe((value) => {
      this.UserTypesView = activatedRoute.snapshot.url[0].path;
    });

    this.SearchForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.Get();

    this.api.TargetComponent.subscribe(
      (page) => {
        if (page == "Ticket") {
          this.Reload();
        }
      },
      (err) => {}
    );
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "example2") {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
      }
    });
  }

  //CLEAR SEARCH
  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.dataAr = [];
    this.ResetDT();
    this.Is_Export = 0;
  }

  //RELAOD
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //RESET DT
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
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
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
              "/WebsiteSection/ViewCurrentOpening?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType()),

            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            if (res.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = res.msg;
              return;
            }
            that.hasAccess = true;
            that.dataAr = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  //VIEW DOCUMENTS
  ViewDocument(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  //ACCEPT REQUEST
  DeleteRequest(DeleteId: any, TableName: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("Id", DeleteId);
      formData.append("TableName", TableName);
      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api.HttpPostType("WebsiteHealthSection/DeleteData", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.Reload();
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
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
  //ACCEPT REQUEST
  ActiveInactive(Id: any, Status: any, TableName: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("Id", Id);
      formData.append("TableName", TableName);
      formData.append("Status", Status);
      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api
        .HttpPostType("WebsiteHealthSection/UpdateActiveInactive", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            // console.log(result);

            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              this.Reload();
            } else {
              const msg = "msg";
              //alert(result['message']);
              this.api.Toast("Warning", result["msg"]);
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

  ViewGetInWindowPoupup(url) {
    const url2 = url;
    window.open(
      url2,
      "",
      "right=150,left=500,top=200,bottom=200 width=700%,height=450"
    );
  }
  AddRequestupdate() {
    const dialogRef = this.dialog.open(AddCurrentOpeningComponent, {
      width: "80%",
      height: "70%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      this.Reload();
    });
  }
  viewMore(exp: any, tech: any, desired: any) {
    const dialogRef = this.dialog.open(ViewMoreComponent, {
      width: "80%",
      height: "70%",
      disableClose: true,
      data: { exp: exp, tech: tech, desired: desired },
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      this.Reload();
    });
  }

  EditRequest(Id: any) {
    const dialogRef = this.dialog.open(EditCurrentOpeningComponent, {
      width: "80%",
      height: "70%",
      disableClose: true,
      data: { Id },
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      //console.log(result);
      // this.SearchBtn();
      this.Get();
    });
  }
} //ENDy
