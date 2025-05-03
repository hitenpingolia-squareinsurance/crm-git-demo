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
import { QuestionnaireDetailsComponent } from "../questionnaire-details/questionnaire-details.component";

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

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: "app-questionnaire",
  templateUrl: "./questionnaire.component.html",
  styleUrls: ["./questionnaire.component.css"],
})
export class QuestionnaireComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  ActivePage: string = "Default";

  searchForm: FormGroup;
  ActionType: any = "";

  isSubmitted = false;
  isSubmitted2 = false;

  dropdownSettingsSingle: any = {};
  dropdownSettingsMultiple: any = {};

  currentUrl: string;
  filterFormData: any[];
  urlSegment: string;
  urlSegmentRoot: string;
  urlSegmentSub: string;
  AddCatForm: any;
  isSubmitted1: boolean;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private uri: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.searchForm = this.formBuilder.group({
      SearchValue: [""],
    });

    this.AddCatForm = this.formBuilder.group({
      Mobile: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$"
          ),
        ],
      ],
    });
  }

  ngOnInit() {
    this.fetchAllEmployeeData();
    this.currentUrl = this.router.url;

    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }

    if (typeof splitted[3] != "undefined") {
      this.urlSegmentSub = splitted[3];
    }
  }

  get formControls2() {
    return this.AddCatForm.controls;
  }

  //===== FETCH ALL SURVEY REQUEST DATA =====//
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
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
              "/b-crm/Employee/fetchAllEmployeeQuestionnaire?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&url=" +
              this.currentUrl +
              "&Action=" +
              this.ActionType),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
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
  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        var fields = this.searchForm.value;
        var query = {
          SearchValue: fields["SearchValue"],
        };

        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
      }
    });
  }

  //===== CLEAR FILTER =====//
  ClearSearch() {
    var fields = this.searchForm.reset();
    this.fetchAllEmployeeData();
    this.Reload();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  SubmitCat() {
    // alert();
    this.isSubmitted1 = true;
    if (this.AddCatForm.invalid) {
      return;
    } else {
      // alert();
      var fields = this.AddCatForm.value;
      const formData = new FormData();

      formData.append("Mobile", fields["Mobile"]);

      // console.log(formData);
      this.api.IsLoading();
      this.api
        .HttpPostType("/b-crm/Employee/QuestionnaireSendMail", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            // console.log(result);

            if (result["Status"] == "Success") {
              this.api.Toast("Success", result["Message"]);
              this.AddCatForm.reset();
              $("#ClosePOUPUP").trigger("click");
            } else {
              const msg = "msg";
              this.api.Toast("Warning", result["Message"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            const newLocal = "Warning";
            this.api.Toast(
              newLocal,
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    }
  }

  QuestionnaireShowPoupup(Id: any) {
    const dialogRef = this.dialog.open(QuestionnaireDetailsComponent, {
      width: "70%",
      height: "80%",
      // disableClose: true,
      data: {
        Id: Id,
      },
      //disableClose : true,
      panelClass: "rv_two",
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      // console.log(result);
      this.Reload();
    });
  }
}
