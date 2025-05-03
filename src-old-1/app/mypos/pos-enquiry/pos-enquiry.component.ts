import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
} from "@angular/core";
import $ from "jquery";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
// import { ClipboardService } from 'ngx-clipboard';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

class ColumnsObj {
  SrNo: string;
  Id: string;
  LOB: string;
  TypeName: string;
  Quotation_Id: string;
  Company: string;
  PolicyNo: string;
  CustomerName: string;
  CustomerMobile: string;
  DownloadUrl: string;
  Vehicle_No: string;
  Policy_Type: string;
  BookingDate: string;
  NetPremium: string;
  IssuedDate: string;
  GrossPremium: string;
  TotalFiles: string;
  TotalPremium: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}

@Component({
  selector: "app-pos-enquiry",
  templateUrl: "./pos-enquiry.component.html",
  styleUrls: ["./pos-enquiry.component.css"],
})
export class PosEnquiryComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  FilterData: ColumnsObj[];

  ActivePage: string = "Default";
  SearchForm: FormGroup;
  AddPosEnquiryForm: FormGroup;

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
  MobileNoDiv: string;
  PaymentLinkStr: any;
  PosEnquiryUrl: string;

  hasAccess: boolean = true;
  errorMessage: string = '';

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.PosEnquiryUrl =
      "https://www.squareinsurance.in/employee/add_pos/" +
      btoa(this.api.GetUserData("Id"));

    this.AddPosEnquiryForm = this.fb.group({
      mobilex: [
        "",
        [
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      // : [""],
      emailx: [
        "",
        [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      ],
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

      SearchValue: [""],
    });
  }

  ngOnInit() {
    this.Get();
  }
  get formControls() {
    return this.SearchForm.controls;
  }

  get Fc() {
    return this.AddPosEnquiryForm.controls;
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
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      this.dtElements.forEach(
        (dtElement: DataTableDirective, index: number) => {
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
              };
              // console.log(query);

              dtInstance
                .column(0)
                .search(this.api.encryptText(JSON.stringify(query)))
                .draw();
            }
          });
        }
      );
    }
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
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/MyPos/ViewMyAgentPosEnquiry?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
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

            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;

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

  AddPosEnquirySubmit() {
    var fields = this.AddPosEnquiryForm.value;
    const formData = new FormData();
    // console.log(fields);

    this.isSubmitted = true;
    if (this.AddPosEnquiryForm.invalid) {
      return;
    } else {
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("mobile", fields["mobilex"]);
      formData.append("email", fields["emailx"]);
      // console.log(fields);

      this.api.IsLoading();
      this.api.HttpPostType("MyPos/share_pos_referal_link", formData).then(
        (result) => {
          this.api.HideLoading();
          // alert(result);
          // console.log(result);

          if (result["Status"] == 1) {
            this.api.Toast("Success", result["msg"]);
          } else if (result["Status"] == 2) {
            return this.AddPosEnquiryForm.controls;
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

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
    // navigator.clipboard.writeText(inputElement);
  }
}
