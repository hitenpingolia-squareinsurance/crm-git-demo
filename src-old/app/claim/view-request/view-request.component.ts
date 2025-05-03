import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ViewPopupComponent } from "../view-popup/view-popup.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ViewSrDetailsComponent } from "../../modals/view-sr-details/view-sr-details.component";
import { DatePipe } from "@angular/common";
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
class ColumnsObj {
  Sno: string;
  Id: string;
  EmployeeName: string;
  Designation: string;
  PersonalEmail: string;
  OfficialEmail: string;
  PersonalMobile: string;
  OfficialMobile: string;
  Branch: string;
  OpsBranch: string;
  Status: string;
  Action: string;
}
@Component({
  selector: "app-view-request",
  templateUrl: "./view-request.component.html",
  styleUrls: ["./view-request.component.css"],
})
export class ViewRequestComponent implements OnInit {
  dropdownSettingsingleselect: any = {};
  dropdownSettingsingleselect1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  currentUrl: string;
  ActionType: any = "";

  SearchForm: FormGroup;
  QuoteTypes: { Id: string; Name: string }[];
  statusData: { Id: string; Name: string }[];
  QuoteTypeVal: { Id: string; Name: string }[];
  // SearchForm: any;
  // SearchForm: any;
  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.SearchForm = this.formBuilder.group({
      // QuoteType: [""],
      // status: [""],
      // SearchValue: [""],
      // QuoteType: [""],
      // Company_Id: [""],
      // LossType: [""],
      // PolicyType: [""],
      // Claim_Status: [""],
      // DateOrDateRange: [""],
      // SearchValue: [""],
    });
    this.QuoteTypes = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];

    this.statusData = [
      { Id: "Pending", Name: "Pending" },
      { Id: "Approve", Name: "Approve" },
      { Id: "Deny", Name: "Deny" },
    ];
  }

  ngOnInit() {
    this.fetchAllEmployeeData();
    this.currentUrl = this.router.url;
  }

  fetchAllEmployeeData() {
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
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/ClaimView/fetchAllEmployeeQuestionnaire?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
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

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== FILTER DATA =====//
  SearchData(event: any) {
    // var fields = this.SearchForm.value;

    // var query = {
    //   QuoteType: fields["QuoteType"],
    //   status: fields["status"],
    //   SearchValue: fields["SearchValue"],
    // };
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        var fields = this.SearchForm.value;

        // var query = {
        //   QuoteType: fields["QuoteType"],
        //   status: fields["status"],
        //   SearchValue: fields["SearchValue"],
        // };

        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
    });
  }

  //===== CLEAR FILTER =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();
    // this.fetchAllEmployeeData();
    this.Reload();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  AddClaim(id: any) {
    // alert(id);
    const dialogRef = this.dialog.open(ViewPopupComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { id: id },
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   this.ResetDT();
    //   this.Get();
    // });
  }

  activeManager(Claim_Id: any) {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("id", Claim_Id);

    this.api.IsLoading();
    this.api.HttpPostType("ClaimView/requestAsc", formData).then(
      (result: any) => {
        this.api.HideLoading();
        // console.log(result)

        if (result["status"] == true) {
          this.Reload();
          // this.fetchAllEmployeeData();
          this.api.Toast("Success", result["msg"]);
          // alert(121)
        } else {
          const msg = "msg";
          //alert(result['message']);
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
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

  // new
  GetPolicyDetails(Type: any) {
    // const dialogRef = this.dialog.open(PolicydetailsComponent, {
    //   width: "70%",
    //   height: "70%",
    //   disableClose: true,
    //   data: { Id: Type },
    // });
    const dialogRef = this.dialog.open(ViewSrDetailsComponent, {
      width: "75%",
      height: "75%",
      data: { Id: Type },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, "dd/MM/yyyy - hh:mm:ss a");
  }
}
