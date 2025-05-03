import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { ApiService } from "src/app/providers/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
// import { ViewMoreComponent } from "../view-more/view-more.component";
// import { AddDataComponent } from "../add-data/add-data.component";
// import { DataDirectoryFollowupComponent } from "../data-directory-followup/data-directory-followup.component";
import { trim } from "jquery";
import { DataDirectoryFollowupComponent } from "src/app/data-directory/data-directory-followup/data-directory-followup.component";
import { ViewMoreComponent } from "src/app/data-directory/view-more/view-more.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  name: string;
  email: string;
  mobile: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-claim-bulk-upload",
  templateUrl: "./claim-bulk-upload.component.html",
  styleUrls: ["./claim-bulk-upload.component.css"],
})
export class ClaimBulkUploadComponent implements OnInit {
  SearchForm: FormGroup;
  SearchForm2: FormGroup;

  Claimform: FormGroup;
  ClaimMasterForm: FormGroup;
  isSubmitted: boolean = false;
  isSubmitted2: boolean = false;
  isSubmitted3: boolean = false;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  totalCount: number;
  currentUrl: string;
  Is_Export: number;
  selectedFiles: any;
  ActivePage: any = "Default";
  file: File;
  LobData: { Id: string; Name: string }[];
  dropdownSettingsingleselect: any;
  CompanyData: any;
  ClaimStatus: { Id: string; Name: string }[];
  ClaimBulkData: any;
  ClaimMasterData: any;
  SessionYearData: { Id: string; Name: string }[];

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.FetchCompanyData();
    this.SearchForm = this.fb.group({
      SearchValue: [""],
    });

    this.SearchForm2 = this.fb.group({
      SearchValue: [""],
    });

    this.Claimform = this.fb.group({
      File: ["", Validators.required],
      lob: ["", Validators.required],
      Company: ["", Validators.required],
      SessionYear: ["", Validators.required],
    });

    this.ClaimMasterForm = this.fb.group({
      ClaimStatusName: ["", Validators.required],
      Claimstatus: ["", Validators.required],
      Company: ["", Validators.required],
    });

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.LobData = [
      { Id: "Non Motor", Name: "Non Motor" },
      { Id: "Motor", Name: "Motor" },
      { Id: "Health", Name: "Health" },
      { Id: "Life", Name: "Life" },
    ];

    this.SessionYearData = [
      { Id: "2017-18", Name: "2017-18" },
      { Id: "2018-19", Name: "2018-19" },
      { Id: "2019-20", Name: "2019-20" },
      { Id: "2020-21", Name: "2020-21" },
      { Id: "2021-22", Name: "2021-22" },
      { Id: "2022-23", Name: "2022-23" },
      { Id: "2023-24", Name: "2023-24" },
      { Id: "2024-25", Name: "2024-25" },
      { Id: "2025-26", Name: "2025-26" },
    ];

    this.ClaimStatus = [
      { Id: "1", Name: "Pending" },
      { Id: "2", Name: "In Process" },
      { Id: "3", Name: "Approve" },
      { Id: "4", Name: "Close" },
      { Id: "5", Name: "Rejected" },
      { Id: "6", Name: "Re-open" },
      { Id: "7", Name: "Partially-Settled" },
      { Id: "8", Name: "Settled" },
    ];
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.Get();
  }

  ClearSearch() {
    //// console.log(this.currentUrl);
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }

  SearchData() {
    this.isSubmitted = true;

    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;
      const post = {
        User_Id: this.api.GetUserData("Id"),
        User_Type: this.api.GetUserType(),
        SearchValue: trim(fields["SearchValue"]),
      };

      // console.log(fields);
      this.Is_Export = 0;
      this.dataAr = [];

      this.datatableElement.dtInstance.then((dtInstance: any) => {
        var TablesNumber = `${dtInstance.table().node().id}`;

        if (TablesNumber == "Table1") {
          dtInstance.column(0).search(JSON.stringify(fields)).draw();
        }
      });
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
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/claim/ViewBulkClaim?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            // // console.log(this.dataAr);
            that.totalCount = resp.recordsFiltered;
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

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  get formControls() {
    return this.Claimform.controls;
  }

  get formControls2() {
    return this.ClaimMasterForm.controls;
  }

  ChangeStatusRenewals(e: any, Id: number, Action: string, Assignerid: any) {
    if (Action == "Button") {
      var Values = e;
      // // console.log(Values);
    } else {
      var Values = e.target.value;
    }
    // var Values = e.target.value;
    var Values2 = 1;
    if (Values == "") {
    } else {
      const dialogRef = this.dialog.open(DataDirectoryFollowupComponent, {
        width: "80%",
        height: "60%",
        data: {
          Id: Id,
          Status: Values,
          Status2: Values2,
          ActionUser: "user",
          AssignerId: Assignerid,
        },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        setTimeout(() => {
          this.Reload();
        }, 500);
      });
    }
  }

  Submit() {
    this.isSubmitted2 = true;
    if (this.Claimform.invalid) {
      return;
    } else {
      var fields = this.Claimform.value;
      const formData = new FormData();
      formData.append("File", fields["File"]);
      formData.append("lob", JSON.stringify(fields["lob"]));
      formData.append("company", JSON.stringify(fields["Company"]));
      formData.append("SessionYear", JSON.stringify(fields["SessionYear"]));
      formData.append("file", this.file);

      this.api.IsLoading();
      this.api.HttpPostType("claim/read_csv", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
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

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      // console.log(this.selectedFiles);
      // console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;

      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (ext == "csv") {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + " kb");

        if (Total_Size >= 1024 * 8) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "file") {
            this.Claimform.get("File").setValue("");
          }
        } else {
          if (Type == "file") {
            this.file = this.selectedFiles;
          }
        }
      } else {
        // console.log("Extenstion is not vaild !");

        this.api.Toast("Warning", "Please choose vaild file ! Example :- csv");

        if (Type == "file") {
          this.Claimform.get("File").setValue("");
        }
      }
    }
  }

  FetchCompanyData() {
    this.api.IsLoading();
    this.api.HttpGetType("claim/FetchInsurerData").then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["Status"] == true) {
          this.CompanyData = result["Data"]["Ins_Compaines"];
          // this.api.Toast("Success", result["msg"]);
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

  AddMaster() {
    this.isSubmitted3 = true;
    if (this.ClaimMasterForm.invalid) {
      return;
    } else {
      var fields = this.ClaimMasterForm.value;
      const formData = new FormData();
      formData.append("Company", JSON.stringify(fields["Company"]));
      formData.append("Claimstatus", JSON.stringify(fields["Claimstatus"]));
      formData.append("ClaimStatusName", fields["ClaimStatusName"]);

      this.api.IsLoading();
      this.api.HttpPostType("claim/AddClaimMaster", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
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

  AddClaimDataForm() {
    this.Claimform.reset();
    this.api.IsLoading();
    this.api.HttpGetType("claim/FetchClaimBulkData").then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == 1) {
          this.ClaimBulkData = result["Data"];
          // this.api.Toast("Success", result["msg"]);
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

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  AddClaimMasterData() {
    this.ClaimMasterForm.reset();

    const formData = new FormData();
    var fields = this.SearchForm2.value;

    formData.append("SearchValue", fields["SearchValue"]);

    this.api.IsLoading();
    this.api.HttpPostType("claim/FetchClaimMasterData", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.ClaimMasterData = result["data"];
          // this.api.Toast("Success", result["msg"]);
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
