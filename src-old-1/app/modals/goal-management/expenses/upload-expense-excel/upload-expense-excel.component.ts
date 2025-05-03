import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { environment } from "../../../../../environments/environment";
import { ApiService } from "../../../../providers/api.service";
import { Router } from "@angular/router";

class ColumnsObj {
  SNo: string;
  Id: string;
  FileUrl: string;
  UploadDate: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  FilterData: any[];
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-upload-expense-excel",
  templateUrl: "./upload-expense-excel.component.html",
  styleUrls: ["./upload-expense-excel.component.css"],
})
export class UploadExpenseExcelComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  SearchForm: FormGroup;
  UploadExcelForm: FormGroup;
  isSubmitted = false;
  selectedFiles: File;
  ExcelFile: File;
  Other_image: any = 0;
  Is_Refresh: any = "No";
  dropdownSettingsingleselect1: any = {};

  constructor(
    public dialogRef: MatDialogRef<UploadExpenseExcelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.UploadExcelForm = this.formBuilder.group({
      Excel_File: [""],
    });

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.Get();
  }

  get FC_6() {
    return this.UploadExcelForm.controls;
  }

  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
      Is_Refresh: this.Is_Refresh,
    });
  }

  //===== CHECK IMAGE TYPE =====//
  checkFileType(event: any, Type: any) {
    this.Other_image = 0;
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      //   //   //   console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      //   //   //   console.log(ext);

      if (ext == "xlsx" || ext == "Xlsx" || ext == "XLSX") {
        //   //   //   console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        //   //   //   console.log(Total_Size + ' kb');

        if (Total_Size >= 1024) {
          // allow only 1 mb
          this.api.Toast("Error", "File size is greater than 2 mb");
        } else {
          if (Type == "Excel") {
            this.ExcelFile = this.selectedFiles;
          }
          this.Other_image = 1;
        }
      } else {
        this.api.Toast("Error", "Please choose vaild file ! Example :- xlsx");
      }
    }
  }

  //===== UPLOAD EXPENSES DATA =====//
  UploadExpenseExcel() {
    this.isSubmitted = true;
    if (this.UploadExcelForm.invalid) {
      return;
    } else {
      var fields = this.UploadExcelForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Code", this.api.GetUserData("Code"));
      formData.append("ExcelFile", this.ExcelFile);
      formData.append("Portal", "CRM");

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms(
          "goal-management-system/expenses/ExpenseManagement/UploadExpenseExcel",
          formData
        )
        .then(
          (result: any) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.Is_Refresh = "Yes";
              this.api.Toast("Success", result["Message"]);
              this.CloseModel();
            } else {
              this.api.Toast("Error", result["Message"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.Toast("Warning", "Network Error, Please try again ! ");
          }
        );
    }
  }

  //===== DOWNLOAD SAMPLE EXCEL =====//
  DownloadSampleExcel() {
    const formData = new FormData();

    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "goal-management-system/expenses/ExpenseExtrasFunctions/DownloadSampleExcel",
        formData
      )
      .then(
        (result: any) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            window.open(result["DownloadUrl"]);
          } else {
            this.api.Toast("Error", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast("Warning", "Network Error, Please try again ! ");
        }
      );
  }

  //===== DOWNLOAD SAMPLE EXCEL =====//
  DownloadUploadedExcel(url: any) {
    window.open(url);
  }

  //===== CLEAR SEARCH FORM =====//
  ClearSearch() {
    this.SearchForm.reset();
    this.dataAr = [];
    this.ResetDT();
  }

  //===== RELOAD PAGE =====//
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== GET DATATABLE DATA =====//
  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        //'Authorization': 'Bearer ' + this.api.GetToken()
      }),
    };

    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [10, 25, 50, 100],
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/goal-management-system/expenses/ExpenseManagement/GridUploadedData?&User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Code=" +
                this.api.GetUserData("Code") +
                "&User_Type=" +
                this.api.GetUserType()
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            that.dataAr = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },

      columnDefs: [
        {
          targets: [0, 1, 2], // column index (start from 0)
          orderable: false, // set orderable false for selected columns
        },
      ],
    };
  }
}
