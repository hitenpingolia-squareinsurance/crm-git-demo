import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditGivenTargetComponent } from "../../modals/goal-management/edit-given-target/edit-given-target.component";
import { ViewGivenTargetComponent } from "../../modals/goal-management/view-given-target/view-given-target.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  VerticalName: string;
  GivenTarget: string;
  InsertDate: string;
  Action: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-given-target-master",
  templateUrl: "./given-target-master.component.html",
  styleUrls: ["./given-target-master.component.css"],
})
export class GivenTargetMasterComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  SearchForm: FormGroup;
  isSubmitted = false;

  Year_Ar: Array<any>;
  Vertical_Ar: Array<any>;
  SelectedYear: any = [];

  maxDate = new Date();
  minDate = new Date();

  ActionType: any = "";
  loginId: any = "";
  loginType: any = "";
  mainOption: any = "";
  subOption: any = "";
  rightType: any = "";

  currentUrl: string;
  filterFormData: any;
  urlSegment: string;
  urlSegmentRoot: string;
  masterType: string;

  dropdownSettingsingleselect: {};
  dropdownSettingsingleselect1: {};

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private uri: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.SearchForm = this.formBuilder.group({
      Financial_Year: ["", [Validators.required]],
      Vertical_Id: [""],
    });

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
      allowSearchFilter: false,
    };
  }

  ngOnInit() {
    this.SearchComponentsData();
    this.FetchGivenTargetsData();
  }

  //===== SEARCH COMPONENTS DATA =====//
  SearchComponentsData() {
    const formData = new FormData();
    formData.append("Portal", "CRM");
    formData.append("PageName", "given-target-master");
    formData.append("User_Code", this.api.GetUserData("Code"));

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms("common/FilterData/SearchComponentsData", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Year_Ar = result["Data"]["YearsArray"];
            this.SelectedYear = result["Data"]["CurrentYear"];
            this.Vertical_Ar = result["Data"]["Vertical"];

            var Values1 = this.SelectedYear[0].Id;
            var Year1 = parseInt(Values1);
            var Year2 = Year1 + 1;

            this.minDate = new Date("04-01-" + Year1);
            this.maxDate = new Date("03-31-" + Year2);
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;

      var query = {
        User_Id: this.api.GetUserData("Id"),
        User_Type: this.api.GetUserType(),
        Financial_Year: fields["Financial_Year"],
        Vertical_Id: fields["Vertical_Id"],
      };

      this.dataAr = [];
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
      });
    }
  }

  //===== FETCH ALL SURVEY REQUEST DATA =====//
  FetchGivenTargetsData() {
    const that = this;
    this.dtOptions = {
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/goal-management-system/PmsMasters/GetGivenTargetsData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
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

  //==== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== FILTER DATA =====//
  SearchData(event: any) {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        dtInstance.column(0).search(JSON.stringify(this.filterFormData)).draw();
      }
    });
  }

  //===== CLEAR FILTER =====//
  ClearSearch() {
    this.FetchGivenTargetsData();
    this.ResetDT();
  }

  //===== INDIVIDUAL TARGET DETAILS =====//
  UpdateGivenTargetModal(row_Id: any): void {
    const dialogRef = this.dialog.open(EditGivenTargetComponent, {
      width: "25%",
      height: "45%",
      disableClose: true,
      data: { Id: row_Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result.Is_Refresh);
      this.ResetDT();
    });
  }

  //===== INDIVIDUAL TARGET DETAILS =====//
  ViewGivenTargetModal(row_Id: any): void {
    const dialogRef = this.dialog.open(ViewGivenTargetComponent, {
      width: "65%",
      height: "80%",
      disableClose: true,
      data: { Id: row_Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result.Is_Refresh);
      this.ResetDT();
    });
  }
} //END
