import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { ViewSrDetailsComponent } from "../../modals/view-sr-details/view-sr-details.component";

class ColumnsObj {
  Id: string;
  isSelected: any;
  Agent_Id: any;
  Posting_Status_Web: any;
  SR_No: string;
  Add_Stamp: string;
  SR_Source: string;
  Booking_Date: string;
  LOB_Name: string;
  Web_Agent_Payout_OD: string;
  Segment_Id: string;
  Product_Id: string;
  SubProduct_Id: string;
  Web_Agent_Payout_TP: any;
  Web_Agent_Payout_OD_Amount: any;
  Web_Agent_Payout_TP_Amount: any;
  Web_Agent_Reward_Amount: any;
  Web_Agent_Scheme_Amount: any;
  Web_Agent_Total_Amount: any;
  LOB_Id: any;
  Source: any;
  Policy_No: any;
  Policy_Type: any;
  Create_Date: any;
  Agent_Name: string;
  RM_Name: string;
  RecoveryRemark: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  PostingCountAr: any;
  SQL_Where: any;
}

@Component({
  selector: "app-recovery",
  templateUrl: "./recovery.component.html",
  styleUrls: ["./recovery.component.css"],
})
export class RecoveryComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  TotalPendingForPosting: number = 0;
  TotalPendingForAccounts: number = 0;
  TotalRejectByAccounts: number = 0;
  TotalPendingForBanking: number = 0;
  TotalRejectByBanking: number = 0;
  TotalApproved: number = 0;
  TotalPaid: number = 0;

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  isSubmitted = false;

  AccountsUser_Ar: Array<any>;

  SRAgentType_Ar: any = [];
  SRLOB_Ar: any = [];
  SRStatus_Ar: any = [];
  SRType_Ar: any = [];
  SRSource_Ar: any = [];
  SR_Payout_Status_Ar: any = [];

  ItemVerticalSelection: any = [];
  ItemEmployeeSelection: any = [];
  ItemLOBSelection: any = [];

  DisableNextMonth: any;

  Assign_User: any = "";
  Remark: any = "";

  masterSelected: boolean;
  checklist: any = [];
  checkedList: any = [];

  maxDate = new Date();
  minDate = new Date();

  SQL_Where_STR: any;
  Is_Export: any = 0;
  currentUrl: string;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.router.events.subscribe((value) => {
      //// console.log(value);
      //// console.log('current route: ', router.url.toString());
      if (router.url.toString() == "/manage-requests/claims") {
        this.ActivePage = "ManageRequests";
      } else {
        this.ActivePage = "Default";
      }
    });

    this.SearchForm = this.fb.group({
      Vertical_Id: ["0"],
      Region_Id: ["0"],
      Sub_Region_Id: ["0"],
      Emp_Id: [""],
      SRAgent_Type: [""],
      Agent_Id: [""],
      Product_Id: [""],
      Company_Id: [""],
      SRLOB: [""],
      CurrentUser_Id: [""],
      SRStatus: [""],
      SRType: [""],
      SR_Source_Type: [""],
      SR_Payout_Status: [""],
      DateOrDateRange: [""],
    });

    // this.SR_Payout_Status_Ar = [
    //   { Id: "0", Name: "PendingForPosting" },
    //   { Id: "1", Name: "PendingForAccounts" },
    //   { Id: "2", Name: "RejectByAccounts" },
    //   { Id: "3", Name: "PendingForBanking" },
    //   { Id: "4", Name: "RejectByBanking" },
    //   { Id: "5", Name: "Approved" },
    //   { Id: "6", Name: "Paid/PayoutTransferred" },
    // ];

    //this.DisableNextMonth = new Date();
  }

  ngOnInit(): void {
    this.Get();
    this.currentUrl = this.router.url;
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "example2") {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
    });
  }

  //===== GET ALL DATA DATATABLE FUNCTION =====//
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
                "/b-crm/Reports/fetchRecoveryReportData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&Action=" +
                this.ActivePage
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            that.SQL_Where_STR = resp.SQL_Where;
            if (that.dataAr.length > 0) {
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },

      columnDefs: [
        {
          targets: [0, 1, 2, 3, 4, 5, 6, 7], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  ViewSR(row_Id): void {
    const dialogRef = this.dialog.open(ViewSrDetailsComponent, {
      width: "95%",
      height: "90%",
      data: { Id: row_Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      //this.Reload();
    });
  }
}
