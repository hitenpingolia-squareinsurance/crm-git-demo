import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";

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
  selector: "app-view-time",
  templateUrl: "./view-time.component.html",
  styleUrls: ["./view-time.component.css"],
})
export class ViewTimeComponent implements OnInit {
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
  loginId: any;

  constructor(
    public api: ApiService,
    private route: Router,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,

    private dialogRef: MatDialogRef<ViewTimeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.id;
    this.meetingId = this.data.meetingId;
    this.meetingId = this.data.meetingId;
    this.loginId = this.data.loginId;
  }

  ngOnInit() {
    this.id = this.data.id;
    this.meetingId = this.data.meetingId;
    this.loginId = this.data.loginId;
    // console.log(this.id);
    // console.log(this.meetingId);
    // console.log(this.loginId);

    this.Get();
  }

  // Get() {

  //   // // console.log(this.id);
  //   this.api.IsLoading();

  //   this.api.HttpGetType('MeetingUrl/MeetingJoinFetch?id=' + this.id + '&meetingId=' + this.meetingId).then((result:any) => {
  //     this.api.HideLoading();

  //     // // console.log(result);

  //     if (result['status'] == 1) {

  //       this.dataAr = result['data'];
  //       // console.log(this.dataAr);

  //     } else {
  //       const msg = 'msg';
  //       //alert(result['message']);
  //       this.api.Toast('Warning', result['msg']);
  //     }

  //   }, (err) => {
  //     // Error log
  //     // // console.log(err);
  //     this.api.HideLoading();
  //     const newLocal = 'Warning';
  //     this.api.Toast(newLocal, 'Network Error : ' + err.name + '(' + err.statusText + ')');
  //     //this.api.ErrorMsg('Network Error :- ' + err.message);
  //   });

  // }

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
                "/MeetingUrl/MeetingTimeFetch?id=" +
                this.id +
                "&meetingId=" +
                this.meetingId +
                "&loginId=" +
                this.loginId +
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

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
