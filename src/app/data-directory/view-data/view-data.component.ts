import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { ApiService } from "src/app/providers/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ViewMoreComponent } from "../view-more/view-more.component";
import { AddDataComponent } from "../add-data/add-data.component";
import { DataDirectoryFollowupComponent } from "../data-directory-followup/data-directory-followup.component";
import { trim } from "jquery";

class ColumnsObj {
  SrNo: string;
  Id: string;
  name: string;
  email: string;
  mobile: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-view-data",
  templateUrl: "./view-data.component.html",
  styleUrls: ["./view-data.component.css"],
})
export class ViewDataComponent implements OnInit {
  SearchForm: FormGroup;
  isSubmitted: boolean = false;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  totalCount: number;
  currentUrl: string;
  Is_Export: number;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      SearchValue: [""],
    });
  }

  ngOnInit() {
    this.currentUrl = this.router.url;

    this.Get();
  }
  ClearSearch() {
    //// console.log(this.currentUrl);
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }

  SearchData() {
    this.isSubmitted = true;

    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;
      const post = {
        User_Id: this.api.GetUserData("Id"),
        User_Type: this.api.GetUserType(),
        SearchValue: trim(fields["SearchValue"]),
      };

      // console.log(fields);
      this.Is_Export = 0;
      this.dataAr = [];

      this.datatableElement.dtInstance.then((dtInstance: any) => {
        var TablesNumber = `${dtInstance.table().node().id}`;

        if (TablesNumber == "Table1") {
          dtInstance.column(0).search(JSON.stringify(fields)).draw();
        }
      });
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
                "/DataDirectory/viewLeads?User_Id=" +
                this.api.GetUserData("Code") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            // // console.log(this.dataAr);
            that.totalCount = resp.recordsFiltered;
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
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ViewDetails(log_data: any) {
    // // console.log(log_data);

    // alert(leadId);

    const dialogRef = this.dialog.open(ViewMoreComponent, {
      width: "60%",
      height: "80%",
      disableClose: true,
      data: { log_data },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      // // console.log(result);
      // this.SearchBtn();
    });
  }

  addleads() {
    const dialogRef = this.dialog.open(AddDataComponent, {
      width: "60%",
      height: "80%",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  ChangeStatusRenewals(e: any, Id: number, Action: string, Assignerid: any) {
    if (Action == "Button") {
      var Values = e;
      // // console.log(Values);
    } else {
      var Values = e.target.value;
    }
    // var Values = e.target.value;
    var Values2 = 1;
    if (Values == "") {
    } else {
      const dialogRef = this.dialog.open(DataDirectoryFollowupComponent, {
        width: "80%",
        height: "60%",
        data: {
          Id: Id,
          Status: Values,
          Status2: Values2,
          ActionUser: "user",
          AssignerId: Assignerid,
        },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        setTimeout(() => {
          this.Reload();
        }, 500);
      });
    }
  }
}
