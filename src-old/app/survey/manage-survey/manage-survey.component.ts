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
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ViewDetailsModalComponent } from "../view-details-modal/view-details-modal.component";

class ColumnsObj {
  sno: string;
  id: string;
  surveyId: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  customerAddress: string;
  vehicleLocation: string;
  pincode: string;
  state: string;
  product: string;
  city: string;
  make: string;
  model: string;
  assignedToEmp: string;
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
  selector: "app-manage-survey",
  templateUrl: "./manage-survey.component.html",
  styleUrls: ["./manage-survey.component.css"],
})
export class ManageSurveyComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dataAr: ColumnsObj[];

  ActivePage: string = "Default";
  TotalFiles: number;

  searchForm: FormGroup;
  ActionType: any = "";
  formTypee: any = "Edit";
  idUsed: any = "";
  loginId: any = "";
  loginType: any = "";
  mainOption: any = "";
  subOption: any = "";
  rightType: any = "";

  isSubmitted = false;
  Is_Export: any = 0;
  currentUrl: string;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private uri: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.loginId = this.api.GetUserData("Id");
    this.loginType = this.api.GetUserType();

    this.searchForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.fetchAllSurveryRequestsData();
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
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/b-crm/Survey/fetchManageRequestsData?User_Id=" +
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

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //===== ACCEPT SURVEY REQUEST =====//
  acceptSurveyRequest(surveyId: any) {
    var Confirms = confirm("Are You Sure..!");

    if (Confirms == true) {
      const formData = new FormData();
      formData.append("loginId", this.loginId);
      formData.append("loginType", this.loginType);
      formData.append("surveyId", surveyId);

      this.api.IsLoading();
      this.api.HttpPostType("b-crm/Survey/acceptSurveyRequest", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.Reload();
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
    } //confirm
  }

  //===== OPEN DETAILS MODAL =====//
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
