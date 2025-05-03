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
import { DataTableDirective } from "angular-datatables";
import { ViewFollowUpsComponent } from "../view-follow-ups/view-follow-ups.component";
import { FollowUpLeadsComponent } from "../../modals/follow-up-leads/follow-up-leads.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  Name: string;
  Category: string;
  Date: string;
  Create_date: string;
  Email: string;
  Mobile: string;
  Message: string;
  Status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-contact-us-query",
  templateUrl: "./contact-us-query.component.html",
  styleUrls: ["./contact-us-query.component.css"],
})
export class ContactUsQueryComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;

  ActionType: any = "";
  // searchform: FormGroup;
  // isSubmitted = false;
  dtElements: any;
  SearchForm: FormGroup;

  isSubmitted = false;
  Is_Export: number;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.Get();
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
  }

  Reload() {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.draw();
    // });
  }
  ResetDT() {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.search('').column(0).search('').draw();
    // });
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

  Get() {
    // alert(this.api.GetUserData("type"));
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
                "/CustomerQuery/ContactUs?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType()
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

  FollowUp(type: any, table_name: any) {
    const dialogRef = this.dialog.open(ViewFollowUpsComponent, {
      width: "80%",
      height: "78%",
      // disableClose: true,
      data: { Id: type, table_name: table_name },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.Get();
      // this.SearchBtn();
    });
  }

  OnchangeFollowups(Type: any, Id: any, table_name: any) {
    var Values = Type.target.value;
    if (Values == "") this.api.Toast("Warning", "Status is mandatory..!");
    else {
      var Confirms = confirm("Are You Sure To Change Status?");
      if (Confirms == true) {
        const dialogRef = this.dialog.open(FollowUpLeadsComponent, {
          width: "80%",
          height: "78%",
          // disableClose: true,
          data: { Type: Values, Id: Id, table_name: table_name },
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          // console.log(result);
          // this.SearchBtn();
        });
      }
    }
  }
}
