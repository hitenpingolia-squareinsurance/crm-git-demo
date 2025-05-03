import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { ViewTimeComponent } from "../view-time/view-time.component";

class ColumnsObj {
  id: string;
  SrNo: string;
  type: string;
  Name: string;
  Quantity: string;
  Add_stamp: string;
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
  selector: "app-squaremeet-detail",
  templateUrl: "./squaremeet-detail.component.html",
  styleUrls: ["./squaremeet-detail.component.css"],
})
export class SquaremeetDetailComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

  ActivePage: string = "Default";
  loadAPI: Promise<any>;

  ActionType: any = "";
  searchform: FormGroup;
  isSubmitted = false;
  id: any;
  meetingId: any;

  constructor(
    public api: ApiService,
    private route: Router,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,

    private dialogRef: MatDialogRef<SquaremeetDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.id;
    this.meetingId = this.data.meetingId;
  }

  ngOnInit() {
    this.id = this.data.id;
    this.meetingId = this.data.meetingId;
    // console.log(this.id);
    this.Get();
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
                "/MeetingUrl/MeetingJoinFetch?id=" +
                this.id +
                "&meetingId=" +
                this.meetingId +
                "&User_Id=" +
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

  viewTime(id: any, meetingId: any, loginId: any) {
    const dialogRef = this.dialog.open(ViewTimeComponent, {
      width: "60%",
      height: "60%",
      disableClose: true,
      data: { id: id, meetingId: meetingId, loginId: loginId },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.Get();
      // this.ResetDT();
    });
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
