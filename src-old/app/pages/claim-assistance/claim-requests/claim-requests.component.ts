import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { ClaimDetailsComponent } from "../../../modals/claim-details/claim-details.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditClaimComponent } from "./../edit-claim/edit-claim.component";
import { PolicydetailsComponent } from "../../../modals/policydetails/policydetails.component";
import { ViewSrDetailsComponent } from "../../../modals/view-sr-details/view-sr-details.component";

class ColumnsObj {
  Id: string;
  Claim_Id: string;
  Claim_Creator: string;
  Claim_Manager: string;
  PolicyType: string;
  LossType: string;
  Intimated_To_Insurer: string;
  Survey_Status: string;
  Add_Stamp: string;
  SrNo: string;
  Status: string;
  CauseOfLossType: string;
  Spot_Survey_Status: string;
  Quotation_Id: string;
  CustomerName: string;
  registration_no: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-claim-requests",
  templateUrl: "./claim-requests.component.html",
  styleUrls: ["./claim-requests.component.css"],
})
export class ClaimRequestsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  ActivePage: string = "Default";
  SearchForm: FormGroup;
  isSubmitted = false;
  buttonDisable = false;
  dropdownSettings: any = {};
  Company_Ar: any = [];
  PolicyType_Ar: any = [];
  LossType_Ar: any = [];
  ClaimStatus_Ar: any = [];
  Is_Export: any = 0;
  dropdownSingleSelect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    //selectAllText: 'Select All',
    //unSelectAllText: 'UnSelect All',
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  QuoteTypes: { Id: string; Name: string }[];
  currentUrl: string;
  QuoteTypesVal: { Id: string; Name: string }[];
  urlSegment: string;
  urlSegmentRoot: string;
  PageType: string;
  selectedFiles: any;
  SubmitBulkClaimForm: FormGroup;
  ClaimFileVal: number;
  ClaimFileValue: File;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.router.events.subscribe((value) => {
      //// console.log(value);
      //// console.log('current route: ', router.url.toString());
      if (router.url.toString() == "/manage-requests/claims") {
        this.ActivePage = "ManageRequests";
      } else {
        this.ActivePage = "Default";
      }
    });

    this.SearchForm = this.fb.group({
      QuoteType: [""],
      Company_Id: [""],
      LossType: [""],
      PolicyType: [""],
      Claim_Status: [""],
      DateOrDateRange: [""],
      SearchValue: [""],
    });

    this.SubmitBulkClaimForm = this.fb.group({
      ClaimFile: ["", [Validators.required]],
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSingleSelect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.QuoteTypes = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];

    this.QuoteTypesVal = [{ Id: "Raise Request", Name: "Raise Request" }];
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }

    if (
      this.urlSegmentRoot == "manage-requests" &&
      this.urlSegment == "claims"
    ) {
      this.PageType = "ManageRequests";
    }

    if (this.urlSegmentRoot == "mis-reports" && this.urlSegment == "claim") {
      this.PageType = "Reports";
    }

    this.Get();
    this.FilterData();

    this.api.TargetComponent.subscribe(
      (page) => {
        // console.log(page);

        if (page == "Claim-Discussion") {
          this.Reload();
        }
      },
      (err) => {}
    );
  }
  get formControls() {
    return this.SearchForm.controls;
  }

  FilterData() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Claim/FilterData?Page=Claim&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            //this.api.Toast('Success',result['msg']);
            this.Company_Ar = result["Company_Ar"];
            this.PolicyType_Ar = result["PolicyType_Ar"];
            this.LossType_Ar = result["LossType_Ar"];
            this.ClaimStatus_Ar = result["ClaimStatus_Ar"];
          } else {
            //alert(result['message']);
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          //// console.log(err);
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  onItemSelect(item: any, type) {}
  onItemDeSelect(item: any, type) {}

  SearchBtn() {
    this.buttonDisable = true;

    //// console.log(this.SearchForm.value);

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

      Company_Id: fields["Company_Id"],
      PolicyType: fields["PolicyType"],
      LossType: fields["LossType"],
      Claim_Status: fields["Claim_Status"],
      SearchValue: fields["SearchValue"],
      QuoteType: fields["QuoteType"],

      To_Date: this.api.StandrdToDDMMYYY(ToDate),
      From_Date: this.api.StandrdToDDMMYYY(FromDate),
    };

    this.Is_Export = 0;
    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
      //this.Is_Export = 1;
    });
  }

  //===== FILTER DATA =====//
  SearchData(event: any) {
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

  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.dataAr = [];
    this.ResetDT();

    this.QuoteTypesVal = [{ Id: "Raise Request", Name: "Raise Request" }];

    this.Is_Export = 0;
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
    this.QuoteTypesVal = [{ Id: "Raise Request", Name: "Raise Request" }];
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
                "/Claim/GridData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&PageType=" +
                this.PageType +
                "&Action=" +
                this.ActivePage
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            this.buttonDisable = false;

            if (that.dataAr.length > 0) {
              //that.Is_Export = 1;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      //columns: [
      //		{ data: 'Id' },
      //		{ data: 'Type' }

      //]
    };
  }

  AcceptClaim(Id: any) {
    var ClaimId = Id;
    const formData = new FormData();

    formData.append("ClaimId", ClaimId);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpPostType(
          "claim/AcceptClaim?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType(),
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              this.SearchBtn();
            } else {
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    }
  }

  // ViewGetInWindowPoupup(url) {
  //   const url2 = "/claim-assistance/view-claim/1/" + url;
  //   window.open(url2, "", "right=150,left=500,top=200,bottom=200 width=700%,height=450");
  // }

  GetClaimDetails(Type: any) {
    const dialogRef = this.dialog.open(ClaimDetailsComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { Id: Type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  GetPolicyDetails(Type: any) {
    // const dialogRef = this.dialog.open(PolicydetailsComponent, {
    //   width: "70%",
    //   height: "70%",
    //   disableClose: true,
    //   data: { Id: Type },
    // });
    const dialogRef = this.dialog.open(ViewSrDetailsComponent, {
      width: "75%",
      height: "75%",
      data: { Id: Type },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  // GetPolicyDetails(Type: any) {
  //   const dialogRef = this.dialog.open(PolicydetailsComponent, {
  //     width: "70%",
  //     height: "70%",
  //     disableClose: true,
  //     data: { Id: Type },
  //   });

  //   dialogRef.afterClosed().subscribe((result:any) => {});
  // }
  EditClaim(Type: any) {
    // alert();
    // disableClose: true,
    const dialogRef = this.dialog.open(EditClaimComponent, {
      width: "80%",
      height: "80%",
      data: { Id: Type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
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
        // alert(Total_Size);
        // console.log(Total_Size + " kb");

        if (Total_Size >= 10240) {
          // allow only 2 mb

          this.api.Toast("Error", "File size is greater than 10 mb");

          if (Type == "ClaimFile") {
            this.SubmitBulkClaimForm.get("ClaimFile").setValue("");
            this.ClaimFileVal = 0;
          }
        } else {
          if (Type == "ClaimFile") {
            this.ClaimFileValue = this.selectedFiles;
            this.ClaimFileVal = 1;
          }
        }
      } else {
        // console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }

  get formControls2() {
    return this.SubmitBulkClaimForm.controls;
  }

  SubmitBulkClaim() {
    this.isSubmitted = true;
    if (this.SubmitBulkClaimForm.invalid) {
      return;
    } else {
      var fields = this.SubmitBulkClaimForm.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      // formData.append('customertype', fields['customertype']);
      // formData.append('inputcustomertype', fields['inputcustomertype']);
      // formData.append('name', fields['name']);
      // formData.append('email', fields['email']);
      // formData.append('mobile', fields['mobile']);
      // formData.append('remarks', fields['remarks']);
      // formData.append('organizationname', fields['organizationname']);
      formData.append("image", this.ClaimFileValue);

      // console.log(formData);

      // // console.log('formData');
      this.api.IsLoading();
      this.api.HttpPostType("claim/UploadClaimExcel", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
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
}
