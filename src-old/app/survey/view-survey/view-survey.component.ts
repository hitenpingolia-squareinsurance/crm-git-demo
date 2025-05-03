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
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ViewDetailsModalComponent } from "../view-details-modal/view-details-modal.component";

class ColumnsObj {
  sno: string;
  id: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  customerAddress: string;
  vehicleLocation: string;
  pincode: string;
  state: string;
  city: string;
  product: string;
  make: string;
  model: string;
  status: string;
  action: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-view-survey",
  templateUrl: "./view-survey.component.html",
  styleUrls: ["./view-survey.component.css"],
})
export class ViewSurveyComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dataAr: ColumnsObj[];

  ActivePage: string = "Default";
  TotalFiles: number;

  searchForm: FormGroup;
  ActionType: any = "";
  loginId: any = "";
  loginType: any = "";
  mainOption: any = "";
  subOption: any = "";
  rightType: any = "";

  isSubmitted = false;
  Is_Export: any = 0;

  dropdownSettingsSingle: any = {};
  dropdownSettingsMultiple: any = {};

  productSelection: any = [];
  employeeData: any = [];
  agentData: any = [];
  productData: any = [];
  makeData: any = [];
  modelData: any = [];
  variantData: any = [];
  statusData: any = [];

  surveyTypeData = [
    { Id: 1, Name: "Endosment" },
    { Id: 2, Name: "Policy Issuance" },
  ];
  currentUrl: string;
  filterFormData: any[];

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private uri: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.statusData = [
      { Id: 0, Name: "Pending" },
      { Id: 1, Name: "In Process" },
      { Id: 2, Name: "Complete" },
    ];

    this.loginId = this.api.GetUserData("Id");
    this.loginType = this.api.GetUserType();

    this.searchForm = this.formBuilder.group({
      employeeName: [""],
      agentName: [""],
      product: [""],
      surveyType: [""],
      status: [""],

      make: [""],
      model: [""],
      variant: [""],
      DateOrDateRange: [""],
      commonSearch: [""],
    });
  }

  ngOnInit() {
    this.getLoginUserRights();
    this.fetchAllSurveryRequestsData();
    this.currentUrl = this.router.url;

    this.api.TargetComponent.subscribe(
      (page) => {
        if (page == "Survey") {
          this.ResetDT();
        }
      },
      (err) => {}
    );
  }

  //===== FETCH ALL SURVEY REQUEST DATA =====//
  fetchAllSurveryRequestsData() {
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
                "/b-crm/Survey/fetchSurveryRequestsData?User_Id=" +
                this.loginId +
                "&User_Type=" +
                this.loginType +
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
            that.TotalFiles = resp.TotalFiles;

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
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
    });
  }

  //===== CLEAR FILTER =====//
  clearSearch() {
    var fields = this.searchForm.reset();
    this.fetchAllSurveryRequestsData();
    this.Is_Export = 0;
    this.ResetDT();
  }

  //===== GET LOGIN USER'S RIGHTS ======//
  getLoginUserRights() {
    //If Admin Login
    if (this.loginType == "admin") {
      this.rightType = "All";
      //If Others Login
    } else {
      this.mainOption = 5;
      this.subOption = "Is_Create";

      const formData = new FormData();
      formData.append("loginId", this.loginId);
      formData.append("loginType", this.loginType);
      formData.append("mainOption", this.loginId);
      formData.append("subOption", this.subOption);

      this.api.IsLoading();
      this.api
        .HttpPostType("b-crm/Universal/getLoginUserRights", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["status"] == true) {
              this.rightType = result["data"];
            } else {
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    }
  }

  openDialog(id: any) {
    const dialogConfig = this.dialog.open(ViewDetailsModalComponent, {
      width: "90%",
      height: "90%",
      data: { sid: id },
    });

    dialogConfig.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }
}
