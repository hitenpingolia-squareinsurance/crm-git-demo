import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { DataTableDirective } from "angular-datatables";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { environment } from "../../../environments/environment";
// import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { of } from "rxjs";
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
  Data: any;
}
declare var $: any;
@Component({
  selector: "app-tds",
  templateUrl: "./tds.component.html",
  styleUrls: ["./tds.component.css"],
})
export class TdsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  AddTDS: FormGroup;
  SearchForm: FormGroup;
  isSubmitted = false;
  SelectedFiles: File;
  TDSZip: File;
  dataAr: any;
  FiscalYear: { Id: string; Name: string }[];
  QuarterSelect: { Id: string; Name: string }[];
  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  CurrentUrl: any;

  progress: number = 0;
  message: string = "";
  Mapping_id: any;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private http: HttpClient,
    private router: Router
  ) {
    this.AddTDS = this.formBuilder.group({
      TDSZip: ["", Validators.required],
      remark: [""],
      FiscalYear: [""],
      Quarter: [""],
    });
    this.SearchForm = this.formBuilder.group({
      Quarter: [""],
      Fiscal_Year: [""],
      SearchValue: [""],
    });
    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.FiscalYear = [
      { Id: "2023-2024", Name: "2023-2024" },
      { Id: "2024-2025", Name: "2024-2025" },
    ];
    this.QuarterSelect = [
      { Id: " Q1", Name: " Q1" },
      { Id: " Q2", Name: " Q2" },
      { Id: " Q3", Name: " Q3" },
      { Id: " Q4", Name: " Q4" },
    ];
  }

  ngOnInit() {
    this.CurrentUrl = this.router.url;
    this.Get();
    $("#exampleModal").modal({
      show: false,
      backdrop: "static",
    });
  }
  get formControls() {
    return this.AddTDS.controls;
  }

  // submit() {
  //   this.isSubmitted = true;
  //   if (this.AddTDS.invalid) {
  //     return;
  //   } else {
  //     var fields = this.AddTDS.value;
  //     const formData = new FormData();;
  //     formData.append("Zip", this.TDSZip);

  //     this.api.HttpPostType('Tdscertificate/addtds', formData).then(
  //       (result) => {
  //         if (result["status"] == true) {
  //           this.api.Toast("Success", result["msg"]);
  //           this.Reload();
  //         } else {
  //           this.api.Toast("Warning", result["msg"]);
  //         }
  //       },
  //       (err) => {
  //         // this.api.HideLoading();
  //         const newLocal = "Warning";
  //         this.api.Toast(
  //           newLocal,
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //       }
  //     );
  //   }
  // }

  submit() {
    if (this.progress != 0) {
      this.api.Toast("Success", "Pls Wait");
      return;
    }
    this;
    this.isSubmitted = true;
    if (this.AddTDS.invalid) {
      return;
    } else {
      const formData = new FormData();
      formData.append("Zip", this.TDSZip);

      this.api.IsLoading();
      this.api
        .HttpPostType("Tdscertificate/addtds", formData)
        .then((result) => {
          this.api.HideLoading();
          if (result["status"]) {
            this.Mapping_id = result["Id"];
            this.progress = 100;
            this.message = "File uploaded successfully!";
            this.api.Toast("Success", this.message);
            this.progress = 0;
            this.Reload();
            this.Mapping();
          } else {
            this.Mapping_id = "";
            this.message = "File upload failed: " + result["msg"];
            this.api.Toast("Warning", "File upload failed");
            this.progress = 0;
            //  document.getElementById("ClosePOUPUP").click();
          }
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
          };
        });
    }
  }

  Close() {
    this.message = "";
    this.progress = 0;
    this.AddTDS.get("TDSZip").setValue("");
  }

  reMapping(id: any) {
    this.Mapping_id = id;
    this.Mapping();
  }

  Mapping() {
    this.api.Toast("Success", "Mapping Start");
    const formData = new FormData();
    formData.append("Mapping_id", this.Mapping_id);

    this.api.HttpPostType("Tdscertificate/Mapping", formData).then(
      (result) => {
        if (result["status"] == true) {
          this.api.Toast("Success", result["msg"]);
          this.Reload();
          // $progressPercentage = ($processedCount / $totalCount) * 100;
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        // this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  UploadDocs(event, Type) {
    this.SelectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.SelectedFiles.name;
      var ar = str.split(".");
      var ext = ar[ar.length - 1].toLowerCase();

      if (ext == "zip") {
        if (Type == "TDSZip") {
          this.TDSZip = this.SelectedFiles;
        }
      } else {
        if (Type == "TDSZip") {
          this.AddTDS.get("TDSZip").setValue("");
        }
        this.api.Toast("Error", "Please choose a valid ZIP file!");
      }
    }
  }
  // table
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== FILTER DATA =====//
  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "kt_datatable") {
        var fields = this.SearchForm.value;
        var query = {
          Quarter: fields["Quarter"],
          Fiscal_Year: fields["Fiscal_Year"],
          Search: fields["SearchValue"],
        };

        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
      }
    });
  }

  //===== CLEAR FILTER =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();
    // this.fetchAllEmployeeData();
    this.Reload();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
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
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/Tdscertificate/ViewUploadfile?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType()
            ),

            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            if (resp["status"] == 1) {
              that.dataAr = resp.data;
            } else {
              that.dataAr = [];
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
} // end
