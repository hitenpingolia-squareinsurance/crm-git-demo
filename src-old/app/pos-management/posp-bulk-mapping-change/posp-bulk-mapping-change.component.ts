import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ApiService } from "src/app/providers/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { DataTableDirective } from "angular-datatables";
import { Router } from "@angular/router";

class ColumnsObj {
  SrNo: string;
  TotalCount: any;
  ActiveCount: any;
  InactiveCount: any;
  UniqueId: any;
  EmployeeName: any;
  EmployeeID: any;
  FilePath: any;
  CreatedAt: any;
}

class BatchDataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  FilterPolicyData: any[];
}

@Component({
  selector: "app-posp-bulk-mapping-change",
  templateUrl: "./posp-bulk-mapping-change.component.html",
  styleUrls: ["./posp-bulk-mapping-change.component.css"],
})
export class PospBulkMappingChangeComponent implements OnInit {
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  bulkUploadForm: FormGroup;
  selectedFiles: File;
  file: File;

  SubmitbulkUploadForm: boolean = false;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  DataArSingle: any;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private http: HttpClient,
    private router: Router
  ) {
    this.bulkUploadForm = this.formBuilder.group({
      file: ["", Validators.required],
      mappingType: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.GetRecords();
  }

  get formcontrolsbulkUploadForm() {
    return this.bulkUploadForm.controls;
  }

  resetbulkUploadForm() {
    this.bulkUploadForm.reset();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      var ext;

      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();

      if (ext == "csv") {
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "file") {
            this.bulkUploadForm.get("file").setValue("");
          }
        } else {
          if (Type == "file") {
            this.file = this.selectedFiles;
          }
        }
      } else {
        this.api.Toast("Warning", "Please choose vaild file ! Example :- csv");

        if (Type == "file") {
          this.bulkUploadForm.get("file").setValue("");
        }
      }
    }
  }

  onSubmitBulkUploadForm() {
    this.SubmitbulkUploadForm = true;
    if (this.bulkUploadForm.invalid) {
      return;
    }
    const formData = new FormData();
    const FIELDS = this.bulkUploadForm.value;

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("image", this.file);
    formData.append("file", "file");
    formData.append("mappingType", FIELDS["mappingType"]);

    this.api.IsLoading();
    this.api.HttpPostType("PospManegment/BulkUpload", formData).then(
      (resp: any) => {
        if (resp.status == false) {
          this.api.HideLoading();
          this.api.Toast("Warning", resp.msg);
          this.bulkUploadForm.reset();
          this.file = null; // Clear the file reference
          this.SubmitbulkUploadForm = false; // Reset submission flag
          // If you have a file input element reference, reset it
          if (this.fileInput) {
            this.fileInput.nativeElement.value = "";
          }
        } else {
          this.api.HideLoading();
          this.api.Toast("Success", resp.msg);
          this.bulkUploadForm.reset();
          this.file = null; // Clear the file reference
          this.SubmitbulkUploadForm = false; // Reset submission flag
          // If you have a file input element reference, reset it
          if (this.fileInput) {
            this.fileInput.nativeElement.value = "";
          }
          document.getElementById("close2").click();
        }
        this.Reload();
        this.api.HideLoading();
      },
      (err) => {
        this.api.HideLoading();
        console.error("Error submitting data:", err);
        this.api.Toast("Error", "Failed to submit data");
        this.bulkUploadForm.reset();
        this.file = null;
        this.SubmitbulkUploadForm = false;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = "";
        }
      }
    );
  }

  GetRecords() {
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
          .post<BatchDataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/PospManegment/FetchFileData?User_Id=" +
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
            // if (that.dataAr.length > 0) {
            // }
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  PospSingleDataView(Id) {
    this.DataArSingle = [];

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Unique_Id", Id);
    this.api.IsLoading();

    this.api.HttpPostType("PospManegment/FetchSingleFileData", formData).then(
      (resp: any) => {
        if (resp.status == true) {
          // this.api.Toast("Success", resp.msg);
          this.DataArSingle = resp.data;

          this.api.HideLoading();
        } else {
          this.api.Toast("Warning", resp.msg);
        }
      },
      (err) => {
        this.api.HideLoading();
        console.error("Error submitting data:", err);
        this.api.Toast("Error", "Failed to Fetch data");
      }
    );
  }

  downloadFile(filePath: string) {
    if (!filePath) {
      // ;
      console.error("No file path provided");
      return;
    }

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = filePath;

    // Extract filename from path
    const filename = filePath.split("/").pop() || "download.csv";
    link.download = filename;

    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadCSVFormat() {
    const link = document.createElement("a");
    link.href = "assets/bulkmappingchange.csv"; // Path inside `src/assets`
    link.download = "bulkmappingchange.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  SharedDataArray(DataArray) {
    console.log(DataArray);
  }
}
