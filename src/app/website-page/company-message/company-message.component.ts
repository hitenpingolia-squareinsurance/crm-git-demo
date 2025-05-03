import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

class ColumnsObj {
  SrNo: any;
  id: any;

  company_name: any;
  message: any;
  status: any;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-company-message",
  templateUrl: "./company-message.component.html",
  styleUrls: ["./company-message.component.css"],
})
export class CompanyMessageComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  Is_Export: number;
  company_name: { Id: string; Name: string }[];
  message: any;

  SubmitForm: FormGroup;
  isSubmitted = false;

  dropdownSettingsmultiselect = {};

  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
    closeDropDownOnSelection: boolean;
  };

  constructor(
    private fb: FormBuilder,
    private api: ApiService,

    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
    };

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: false,
    };
    this.SearchForm = this.formBuilder.group({
      Search: [""],
    });

    this.SubmitForm = this.fb.group({
      company_name: ["", Validators.required],
      message: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.Fetchlob();
    this.Get();
  }

  ClearSearch() {
    this.SearchForm.reset();
    this.Reload();
    this.ResetDT();
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

  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      // if (TablesNumber == "Table1") {
      var fields = this.SearchForm.value;

      //   //   //   console.log("The search value is :- ", fields);

      var query = {
        Search: fields["Search"],
      };

      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
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
      dom: "ilpftripl",

      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/WebsitePages/FetchCompanyWarning?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType()
            ),

            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
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

  ActiveInactive(Id: any, Status: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("id", Id);

      formData.append("status", Status);
      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api.HttpPostType("WebsitePages/UpdateActiveInactive", formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.Reload();
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

  Fetchlob() {
    this.api.IsLoading();
    this.api.HttpGetType("WebsitePages/companyDropDown").then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] === "success") {
          this.company_name = result["data"].map((item, index) => ({
            Id: item.code,
            Name: item.name,
          }));
        } else {
          this.api.Toast("Warning", result["message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error: " + err.name + " (" + err.statusText + ")"
        );
      }
    );
  }

  CloseModel() {
    $("#ClosePOUPUP").click();
  }

  submit() {
    this.isSubmitted = true;
    if (this.SubmitForm.valid) {
      var fields = this.SubmitForm.value;

      //   //   //   console.log("The values are :- ", fields);

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("company_name", fields["company_name"][0]["Id"]);
      formData.append("message", fields["message"]);

      this.api.IsLoading();
      this.api.HttpPostType("WebsitePages/AddCompanyWarningMSg", formData).then(
        (result: any) => {
          this.api.HideLoading();

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            // this.CloseModel();
            this.SubmitForm.reset();
            $("#ClosePOUPUP").click();
            this.Reload();
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
    } else {
      return;
    }
  }

  get formControls() {
    return this.SubmitForm.controls;
  }
}
