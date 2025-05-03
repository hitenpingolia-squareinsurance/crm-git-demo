import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  ElementRef,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

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
  LOB: string;
  TypeName: string;
  Quotation_Id: string;
  Company: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-rfq-form-coverage",
  templateUrl: "./rfq-form-coverage.component.html",
  styleUrls: ["./rfq-form-coverage.component.css"],
})
export class RfqFormCoverageComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  @ViewChild("videoPlayer", { static: false })
  videoplayer: ElementRef;

  isPlay: boolean = false;
  ColValData: { Id: string; Name: string }[];
  CategoryData: { Id: string; Name: string }[];
  AddCatForm: any;
  dropdownMultiSelectSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  SendmailForm: FormGroup;
  isSubmitted = false;
  buttonDisable = false;

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
  minDate: Date;
  maxDate: Date;
  financialYearVal: { Id: string; Name: string }[];
  currentUrl: string;
  Login_Type: string | null;
  videourl: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    public sanitizer: DomSanitizer,
    public fb: FormBuilder
  ) {
    this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownMultiSelectSettingsType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.ColValData = [
      {
        Id: "Input",
        Name: "Input",
      },
      {
        Id: "Checkbox",
        Name: "Checkbox",
      },
    ];
    this.CategoryData = [
      {
        Id: "Base Coverages",
        Name: "Base Coverages",
      },
      {
        Id: "Burglary Coverages",
        Name: "Burglary Coverages",
      },
    ];

    this.AddCatForm = this.fb.group({
      Category: [""],
      Description: ["", Validators.required],
      ColVal: ["", Validators.required],
      Title: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.Get();

    this.Login_Type = this.api.GetUserType();
  }

  get formControls() {
    return this.SearchForm.controls;
  }

  ClearSearch() {
    this.buttonDisable = true;
    this.ResetDT();
  }
  get formControls2() {
    return this.AddCatForm.controls;
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];

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

  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };
    this.buttonDisable = true;

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
                "Rfq/ViewRfqCoverages?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&Action=" +
                this.ActionType +
                "&Pos_Type=" +
                this.api.GetUserData("pos_type")
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            this.buttonDisable = false;
            that.dataAr = resp.data;
            if (that.dataAr.length > 0) {
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
              FilterPolicyData: [],
              FilterArray: [],
            });
          });
      },
    };
  }

  ViewVideo(url) {
    this.videourl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  SubmitCat() {
    // alert();
    this.isSubmitted = true;
    if (this.AddCatForm.invalid) {
      return;
    } else {
      // alert();
      var fields = this.AddCatForm.value;
      const formData = new FormData();

      formData.append("ColVal", JSON.stringify(fields["ColVal"]));
      formData.append("Category", JSON.stringify(fields["Category"]));
      formData.append("Title", fields["Title"]);
      formData.append("Description", fields["Description"]);

      // console.log(formData);
      this.api.IsLoading();
      this.api.HttpPostType("Rfq/AddCoverage", formData).then(
        (result) => {
          this.api.HideLoading();

          // console.log(result);

          if (result["Status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.AddCatForm.reset();
            $("#ClosePOUPUP").trigger("click");
            // this.CategoryData();

            // this.CategoryData = result["Data"];
          } else {
            const msg = "msg";
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
        }
      );
    }
  }

  UpdateEmployeeResignation(
    TableName: any,
    status: any,
    columnName: any,
    primaryId: any
  ) {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("TableName", TableName);
    formData.append("Id", primaryId);
    formData.append("Status", status);
    formData.append("ColName", columnName);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api.HttpPostType("Rfq/UpdateRfqCoverageAction", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.ResetDT();
          } else {
            const msg = "msg";
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
        }
      );
    }
  }
}
