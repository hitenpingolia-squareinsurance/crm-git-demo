import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { SquaremeetDetailComponent } from "../squaremeet-detail/squaremeet-detail.component";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
// import { AddContactComponent } from '../add-contact/add-contact.component';
// import { SendnotificationComponent } from '../sendnotification/sendnotification.component';

class ColumnsObj {
  SrNo: string;
  Id: string;
  contacttype: string;
  name: string;
  email: string;
  mobile: string;
  remark: string;
  date: string;
  Status: string;
  delete_status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-digital-meeting",
  templateUrl: "./digital-meeting.component.html",
  styleUrls: ["./digital-meeting.component.css"],
})
export class DigitalMeetingComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;

  dtElements: any;
  SearchForm: FormGroup;

  isSubmitted = false;
  Is_Export: number;

  current_url: SafeResourceUrl;

  constructor(
    public sanitizer: DomSanitizer,
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

  updateSrc(url) {
    this.current_url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
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
                "/MeetingUrl/MeetingFetch?Login_User_Id=" +
                this.api.GetUserData("Id") +
                "&Login_User_Type=" +
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

  SendNotification(id: any, meetingId: any) {
    const dialogRef = this.dialog.open(SquaremeetDetailComponent, {
      width: "60%",
      height: "60%",
      disableClose: true,
      data: { id: id, meetingId: meetingId },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.Get();
      this.ResetDT();
    });
  }

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
    // navigator.clipboard.writeText(inputElement);
  }
}
