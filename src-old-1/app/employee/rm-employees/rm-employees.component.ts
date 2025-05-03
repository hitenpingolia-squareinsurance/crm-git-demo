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

class ColumnsObj {
  SrNo: string;
  Id: string;
  Name: string;
  emp_id: string;
  Email: string;
  Mobile: string;
  Department: string;
  Branch: string;
  reportin_manager: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-rm-employees",
  templateUrl: "./rm-employees.component.html",
  styleUrls: ["./rm-employees.component.css"],
})
export class RmEmployeesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;

  dtElements: any;
  SearchForm: FormGroup;

  isSubmitted = false;
  Is_Export: number;
  id: any;
  name: any;
  empid: any;
  mobile: any;
  branch: any;
  profile: any;
  email: any;
  rmid: any;
  rmname: any;
  designation: any;
  dataArr: any;
  RMid: any;
  records: any;
  reportingid: any;
  departmentname: any;
  Masking: any = "Temp";
  extensionno: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RmEmployeesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.id;

    // this.name = this.data.name;
    // this.empid = this.data.emp_id;

    // this.mobile = this.data.mobile;
    // this.branch = this.data.branch;
    // this.profile = this.data.profile;
    // this.email = this.data.email;
    // this.rmname = this.data.rmname;
    // this.rmid = this.data.rmid;
    // this.designation = this.data.designation;

    // // console.log(this.name);
  }

  ngOnInit() {
    this.Get();
    this.getValueEdit();
  }
  ShowMaskingField(i) {
    this.Masking = i;
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
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
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
    });
  }

  getValueEdit() {
    // console.log(this.id);

    //  var fields = this.loginform.value;
    const formData = new FormData();

    // formData.append("login_type",  this.api.GetUserType());

    // formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", this.id);

    this.api.IsLoading();
    this.api
      .HttpPostType("EmployeeDirectory/FetchRMEmployeeDetails2", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["Status"] == true) {
            this.dataArr = result["Data"];

            this.name = this.dataArr.Name;
            this.email = this.dataArr.Email;
            this.mobile = this.dataArr.Mobile;
            this.profile = this.dataArr.Profile;
            this.designation = this.dataArr.Designation;
            this.branch = this.dataArr.Branch;
            this.rmname = this.dataArr.reporting_manager;
            this.reportingid = this.dataArr.reporting_id;
            this.RMid = this.dataArr.RMid;
            this.departmentname = this.dataArr.Department;
            this.extensionno = this.dataArr.extension_no;
            //   //   //   console.log(this.extensionno);
            // // console.log(this.name);
            // this.DocswalletForm.patchValue(this.dataArr);

            // this.api.Toast("Success", result["msg"]);
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

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
    // navigator.clipboard.writeText(inputElement);
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
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/EmployeeDirectory/FetchRMEmployeeDetails?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&emp_id=" +
                this.id
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            that.records = resp.recordsTotal;

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

  EmpDetails(id: any) {
    this.id = id;
    this.Reload();
    this.getValueEdit();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
