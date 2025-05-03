import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  QueryList,
  ViewChildren,
} from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { MailFormComponent } from "../mail-form/mail-form.component";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/providers/api.service";
import { RecipientsComponent } from "../recipients/recipients.component";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}
@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"],
})
export class DetailsComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];
  type: any;
  bulkId: any;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<MailFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = this.data.type;
    this.bulkId = this.data.bulkId;
    ////   //   console.log(this.type);
  }

  ngOnInit() {
    this.Get();
  }

  closeDialog(): void {
    this.dialogRef.close({});
  }

  Get() {
    this.api.IsLoading();

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     Authorization: this.api.GetToken()
    //   })
    // };

    const that = this;
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: false,
      ordering: false,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/../v3/bulk/BulkMails/GetDetails?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&type=" +
                this.type +
                "&bulk=" +
                this.bulkId
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            ////   //   console.log(that.dataAr);
            this.api.HideLoading();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  recipients(id: any) {
    const dialogRef = this.dialog.open(RecipientsComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { type: id },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
