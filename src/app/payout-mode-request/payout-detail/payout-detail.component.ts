import { Component, OnInit, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { ApiService } from "src/app/providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { PayoutReportComponent } from "../payout-report/payout-report.component";
import { ViewMoreComponent } from "../view-more/view-more.component";
import { V2PayInDataviewComponent } from "src/app/modals/brokerage/v2-pay-in-dataview/v2-pay-in-dataview.component";

@Component({
  selector: "app-payout-detail",
  templateUrl: "./payout-detail.component.html",
  styleUrls: ["./payout-detail.component.css"],
})
export class PayoutDetailComponent implements OnInit {
  id: any;
  dataAr: any[] = [];
  expandedRM: boolean = false;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private httpClient: HttpClient,
    private route: ActivatedRoute,

    private dialogRef: MatDialogRef<PayoutReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;
  }

  ngOnInit() {
    this.Get();
  }

  Get() {
    const formData = new FormData();
    formData.append("id", this.id);
    formData.append("Login_User_Id", this.api.GetUserData("Id"));

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms("../v2/PayoutModeRequest/viewDetail", formData)
      .then(
        (resp) => {
          this.api.HideLoading();
          this.dataAr = resp["data"][0];
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  LoadMore(tilte: any, ar: any) {
    const dialogRef = this.dialog.open(V2PayInDataviewComponent, {
      width: "75%",
      height: "70%",
      disableClose: true,
      data: { Type: tilte, DataAr: ar },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
