import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { trim } from "jquery";
import { DatePipe } from "@angular/common";

class ColumnsObj {
  SrNo: string;
  Id: string;
  contacttype: string;
  name: string;
  email: string;
  mobile: string;
  remark: string;
  date: string;
  Status: string;
  delete_status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-block-email-mobile",
  templateUrl: "./block-email-mobile.component.html",
  styleUrls: ["./block-email-mobile.component.css"],
})
export class BlockEmailMobileComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  empType: any;

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettingsMultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
    closeDropDownOnSelection: boolean;
    showSelectedItemsAtTop: boolean;
    defaultOpen: boolean;
    limitSelection: number;
  };

  // dataAr: any;

  BlockEmailMobile: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;
  // dataAr2: any;
  dtElements: any;
  SearchForm: FormGroup;
  Is_Export: number;

  selectedFiles: File;
  policywording: File;
  proposal: File;
  claim: File;
  brochure: File;
  hospitallist: File;

  ActionType: any = "";

  showTable: any = 1;

  Company: any;
  Type: any;

  SubProducts: { Id: number; Name: string }[];
  productvalue: any;
  id: any;
  type: any;
  dataArr: any;
  url: string;
  company: any[];
  product: any;
  sub_product: any;
  types: any;
  file: File;
  pipe: any;
  changedDate: any;
  minDate: Date;
  CurrentUrl: string;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.CurrentUrl = window.location.pathname;

    this.BlockEmailMobile = this.formBuilder.group({
      Mobile: ["", [Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")]],

      Email: [
        "",
        [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      ],
      Reason: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    // console.log(this.CurrentUrl);
    this.Get();
  }

  get formControls() {
    return this.BlockEmailMobile.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.BlockEmailMobile.invalid) {
      return;
    } else {
      var fields = this.BlockEmailMobile.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());
      formData.append("Reason", fields["Reason"]);
      formData.append("Mobile", fields["Mobile"]);
      formData.append("Email", fields["Email"]);

      // console.log(formData);

      // // console.log('formData');
      this.api.IsLoading();
      this.api
        .HttpPostType("WebsiteSection/AddBlockEmailMobile", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            // console.log(result);
            if (result["status"] == 1) {
              this.api.Toast("Success", result["msg"]);
              this.BlockEmailMobile.reset();
              this.Get();
              this.isSubmitted = false;

              // this.router.navigate(["Mypos/View-Docs"]);
            } else {
              const msg = "msg";
              //alert(result['message']);
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            // Error log
            // // console.log(err);
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
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
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
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
      }
    });
  }

  Get() {
    // alert(this.api.GetUserData("type"));
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
      // dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
              "/WebsiteSection/BlockEmailFetch?Login_User_Id=" +
              this.api.GetUserData("Id") +
              "&Login_User_Type=" +
              this.api.GetUserType() +
              "&url=" +
              this.CurrentUrl),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            // console.log(that.dataAr);
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

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
    // navigator.clipboard.writeText(inputElement);
  }
}
