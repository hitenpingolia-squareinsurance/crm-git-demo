import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FollowUpReportComponent } from "../../modals/follow-up-report/follow-up-report.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

class ColumnsObj {
  SrNo: string;
  Id: string;
  Status: any;
  Name: any;
  AgentId: any;
  Email: string;
  Mobile_No: string;
  Employee: any;
  Busniess: string;
  Totalpolicy: string;
  LastLogin: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}
@Component({
  selector: "app-posp-reports",
  templateUrl: "./posp-reports.component.html",
  styleUrls: ["./posp-reports.component.css"],
})
export class PospReportsComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;

  isSubmitted = false;

  Ins_Compaines: any = [];
  GlobelLOB: any = [];
  PolicyFileType: any = [];
  PolicyType: any = [];
  ProductType: any = [];
  SR_Session_Year: any = [];
  SRSource_Ar: any = [];
  filterrd: any = [];

  dropdownSettingsmultiselect: any = {};
  dropdownSettingsingleselect: any = {};

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";

  QidSr: any;

  //selected
  ItemLOBSelection: any = [];
  SelectStatus: any;
  filterFormData: any[];
  datatableElement: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.SearchForm = this.fb.group({
      SelectStatus: [""],
      DateOrDateRange: [""],
      SearchValue: [""],
    });

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.SearchForm = this.fb.group({
      DateOrDateRange: [""],
      SelectStatus: [""],
      PosBusniessstatus: [""],
    });

    this.SelectStatus = [
      { Id: "1", Name: "Active" },
      { Id: "0", Name: "Inactive" },
    ];
  }

  ngOnInit(): void {
    this.Get();
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    //  this.dataAr = [];
    this.ResetDT();

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

  SearchBtn() {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        var TablesNumber = `${dtInstance.table().node().id}`;
        if (TablesNumber == "Table1") {
          var fields = this.SearchForm.value;
          var DateOrDateRange = fields["DateOrDateRange"];
          var ToDate, FromDate;
          if (DateOrDateRange) {
            ToDate = DateOrDateRange[0];
            FromDate = DateOrDateRange[1];
          }
          var query = {
            User_Id: this.api.GetUserData("Id"),
            User_Type: this.api.GetUserType(),
            To_Date: this.api.StandrdToDDMMYYY(ToDate),
            From_Date: this.api.StandrdToDDMMYYY(FromDate),
            SearchValue: fields["SearchValue"],
            PosStatus: fields["PosBusniessstatus"],
          };
          // console.log(query);

          dtInstance
            .column(0)
            .search(this.api.encryptText(JSON.stringify(query)))
            .draw();
        }
      });
    });
  }

  // //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        // // console.log(`The DataTable ${index} instance ID is: ${dtInstance.table().node().id}`);
        this.filterFormData = [];

        this.filterFormData.push(event);

        var TablesNumber = `${dtInstance.table().node().id}`;

        if (TablesNumber == "Table1") {
          dtInstance
            .column(0)
            .search(JSON.stringify(this.filterFormData))
            .draw();
        }
      });
    });

    //   this.Is_Export = 0;
    //   this.dataAr = [];
    //   this.filterFormData = [];
    //   this.filterFormData.push(event);

    //   this.datatableElement.dtInstance.then((dtInstance: any) => {
    //     var TablesNumber = `${dtInstance.table().node().id}`;
    //     // console.log(this.filterFormData);
    //     dtInstance.column(0).search(JSON.stringify(this.filterFormData)).draw();

    //   });
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
                "/reports/PospReport/ActiveInactivePospData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            // console.log(that.dataAr);

            that.FilterData = resp.FilterPolicyData;

            if (that.dataAr.length > 0) {
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
              FilterPolicyData: [],
            });
          });
      },
    };
  }

  FollowUp(id: any): void {
    const dialogRef = this.dialog.open(FollowUpReportComponent, {
      width: "95%",
      height: "90%",
      data: { Id: id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }
}
